import { Request, Response } from 'express';
import { BaseUseCase } from '../../BaseUseCase.js';
import { GoogleSignInRequest, googleSignInRequestSchema, GoogleSignInData } from './types.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import jwt from 'jsonwebtoken';
import { logger } from '../../../core/logger/logger.js';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client.js';
import { IUserCreationAttributes, UserModel } from '../../../models/UserModel.js';

class GoogleSignInUseCase extends BaseUseCase<{}, {}, GoogleSignInRequest, {}, GoogleSignInData> {
  userRepository: UserRepository;
  googleClient: OAuth2Client;

  constructor(request: Request<{}, {}, GoogleSignInRequest, {}>, response: Response, userRepository: UserRepository) {
    super(request, response);
    this.userRepository = userRepository;
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');
  }

  async validate() {
    this.request.body = googleSignInRequestSchema.parse(this.request.body);
  }

  private async exchangeCodeForTokens(code: string): Promise<GetTokenResponse> {
    try {
      const tokens = await this.googleClient.getToken(code);
      logger.info('GoogleSignInUseCase.exchangeCodeForTokens() :: tokens retrieved');

      if (!tokens.tokens.id_token) {
        logger.error('GoogleSignInUseCase.exchangeCodeForTokens() :: Failed to retrieve ID token.');
        throw new Error('GOOGLE_CODE_EXCHANGE_FAILED');
      }

      return tokens;
    } catch (error) {
      logger.error('GoogleSignInUseCase.exchangeCodeForTokens() :: Error exchanging code', error);
      throw new Error('GOOGLE_CODE_EXCHANGE_FAILED');
    }
  }

  private async verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        logger.warn('GoogleSignInUseCase.verifyGoogleIdToken() :: Invalid Google token payload');
        throw new Error('GOOGLE_AUTH_FAILED');
      }

      if (!payload.email) {
        logger.warn('GoogleSignInUseCase.verifyGoogleIdToken() :: No email found in payload');
        throw new Error('GOOGLE_AUTH_FAILED');
      }

      if (!payload.email_verified) {
        logger.warn(`GoogleSignInUseCase.verifyGoogleIdToken() :: Email not verified for ${payload.email}`);
        throw new Error('GOOGLE_EMAIL_NOT_VERIFIED');
      }

      logger.debug(`GoogleSignInUseCase.verifyGoogleIdToken() :: ID Token verified successfully for ${payload.email}.`);

      return payload;
    } catch (verifyError) {
      logger.error('GoogleSignInUseCase.verifyGoogleIdToken() :: ID Token verification failed', verifyError);
      throw new Error('GOOGLE_AUTH_FAILED');
    }
  }

  private async findOrCreateUser(payload: TokenPayload): Promise<UserModel> {
    if (!payload.email) {
      // This should technically be caught by verifyGoogleIdToken, but defensive check
      logger.error('GoogleSignInUseCase.findOrCreateUser :: Payload missing email.');
      throw new Error('GOOGLE_AUTH_FAILED');
    }

    let user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      logger.info(`GoogleSignInUseCase.findOrCreateUser :: Creating new user for ${payload.email}`);

      try {
        const newUserAttributes: IUserCreationAttributes = {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          avatarUrl: payload.picture,
          googleSub: payload.sub,
        };

        user = await this.userRepository.add(newUserAttributes);
        logger.info(`GoogleSignInUseCase.findOrCreateUser :: New user created with ID: ${user.dataValues.id}`);
      } catch (error) {
        logger.error(`GoogleSignInUseCase.findOrCreateUser :: User creation failed for ${payload.email}`, error);
        throw new Error('USER_CREATION_FAILED');
      }
    } else {
      logger.info(`GoogleSignInUseCase.findOrCreateUser :: User already exists for ${payload.email}`);

      // Link Google account if not already linked
      await this.linkGoogleAccountIfNeeded(user, payload);
    }
    return user;
  }

  private async linkGoogleAccountIfNeeded(user: UserModel, payload: TokenPayload): Promise<void> {
    if (!user.dataValues.googleSub && payload.sub) {
      logger.info(
        `GoogleSignInUseCase.linkGoogleAccountIfNeeded :: Linking Google ID to existing user ${user.dataValues.email}`
      );

      try {
        await this.userRepository.model().update(
          {
            googleSub: payload.sub,
            avatarUrl: payload.picture ?? user.dataValues.avatarUrl, // Keep existing if new one isn't provided
          },
          { where: { id: user.dataValues.id } }
        );

        logger.info(
          `GoogleSignInUseCase.linkGoogleAccountIfNeeded :: Linked Google account for user ID ${user.dataValues.id}`
        );
      } catch (error) {
        logger.error(
          `GoogleSignInUseCase.linkGoogleAccountIfNeeded :: Failed to link Google account for user ID ${user.dataValues.id}`,
          error
        );

        throw new Error('GOOGLE_ACCOUNT_LINK_FAILED');
      }
    }
  }

  private generateJwtToken(user: UserModel): string {
    const payload = { id: user.dataValues.id, email: user.dataValues.email };
    logger.debug(`GoogleSignInUseCase.generateJwtToken :: Generating token for user ID ${user.dataValues.id}`);

    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'some_jwt_secret', { expiresIn: '7d' });
      return token;
    } catch (error) {
      logger.error(
        `GoogleSignInUseCase.generateJwtToken :: Failed to sign JWT for user ID ${user.dataValues.id}`,
        error
      );

      throw new Error('JWT_SIGNING_FAILED');
    }
  }

  async execute() {
    try {
      const { code } = this.request.body;

      // 1. Exchange code for tokens
      const googleTokens = await this.exchangeCodeForTokens(code);
      if (!googleTokens.tokens.id_token) {
        throw new Error('GOOGLE_CODE_EXCHANGE_FAILED');
      }

      // 2. Verify ID token and get payload
      const googlePayload = await this.verifyGoogleIdToken(googleTokens.tokens.id_token);

      // 3. Find existing user or create a new one, linking Google account if necessary
      const user = await this.findOrCreateUser(googlePayload);

      // 4. Generate JWT token for the user session
      const token = this.generateJwtToken(user);

      return {
        token,
      };
    } catch (error) {
      logger.error('GoogleSignInUseCase.execute() :: error => ', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, GoogleSignInRequest, {}>, response: Response) {
    return new GoogleSignInUseCase(request, response, new UserRepository());
  }
}

export default GoogleSignInUseCase;
