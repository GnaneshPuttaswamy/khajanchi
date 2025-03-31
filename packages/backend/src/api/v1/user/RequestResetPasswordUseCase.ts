import { Request, Response } from 'express';
import { BaseUseCase } from '../../BaseUseCase.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import jwt from 'jsonwebtoken';
import { logger } from '../../../core/logger/logger.js';
import EmailInterface from '../../../core/email/EmailInterface.js';
import GoogleEmail from '../../../core/email/GoogleEmail.js';
import { requestResetPasswordRequest, RequestResetPasswordRequest } from './types.js';

export class RequestResetPasswordUseCase extends BaseUseCase<{}, {}, RequestResetPasswordRequest, {}, {}> {
  userRepository: UserRepository;
  emailService: EmailInterface;

  constructor(
    request: Request<{}, {}, RequestResetPasswordRequest, {}>,
    response: Response,
    userRepository: UserRepository,
    emailService: EmailInterface
  ) {
    super(request, response);
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async validate() {
    this.request.body = requestResetPasswordRequest.parse(this.request.body);
  }

  async execute() {
    try {
      const { email } = this.request.body;

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return {};
      }

      // Generate reset token using JWT
      const resetToken = jwt.sign(
        {
          id: user.dataValues.id,
          purpose: 'password_reset',
        },
        process.env.JWT_SECRET || 'some_jwt_secret',
        {
          expiresIn: '24h',
        }
      );

      // Create reset URL
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const htmlBody = `
      <h1>Password Reset</h1>
      <p>Hello,</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetUrl}" style="color: #4a6ee0; font-weight: bold;">Click here to reset your password</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p><strong>Please note:</strong> This link is valid for 24 hours.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Thank you,<br>Khajanchi Team</p>
      `;

      const textBody = `
      PASSWORD RESET

      Hello,

      We received a request to reset your password.

      Reset your password by visiting this link:
      ${resetUrl}

      Please note: This link is valid for 24 hours.

      If you didn't request a password reset, please ignore this email.

      Thank you,
      Khajanchi Team
      `;

      await this.emailService.sendEmail(email, 'Khajanchi - Password Reset Request', textBody, htmlBody);

      return {};
    } catch (error) {
      logger.error('RequestResetPasswordUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, RequestResetPasswordRequest, {}>, response: Response) {
    const emailService = new GoogleEmail({
      user: process.env.GOOGLE_EMAIL as string,
      appPassword: process.env.GOOGLE_EMAIL_APP_PASSWORD as string,
    });

    return new RequestResetPasswordUseCase(request, response, new UserRepository(), emailService);
  }
}
