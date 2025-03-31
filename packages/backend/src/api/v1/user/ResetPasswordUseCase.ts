import { Request, Response } from 'express';
import { BaseUseCase } from '../../BaseUseCase.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../../../core/logger/logger.js';
import { resetPasswordRequest, ResetPasswordRequest } from './types.js';

export class ResetPasswordUseCase extends BaseUseCase<{}, {}, ResetPasswordRequest, {}, {}> {
  userRepository: UserRepository;

  constructor(request: Request<{}, {}, ResetPasswordRequest, {}>, response: Response, userRepository: UserRepository) {
    super(request, response);
    this.userRepository = userRepository;
  }

  async validate() {
    this.request.body = resetPasswordRequest.parse(this.request.body);
  }

  async execute() {
    try {
      const { token, password } = this.request.body;

      // Verify and decode the token
      let decodedToken;

      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'some_jwt_secret') as {
          id: string;
          purpose: string;
        };
      } catch (error) {
        if ((error as Error).name === 'TokenExpiredError') {
          throw new Error('Reset link has expired');
        }

        throw new Error('Invalid reset link');
      }

      // Verify token purpose
      if (decodedToken.purpose !== 'password_reset') {
        throw new Error('Invalid reset link');
      }

      const user = await this.userRepository.model().findByPk(decodedToken.id);
      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update password
      await this.userRepository.model().update({ password: hashedPassword }, { where: { id: decodedToken.id } });

      return {};
    } catch (error) {
      logger.error('ResetPasswordUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, ResetPasswordRequest, {}>, response: Response) {
    return new ResetPasswordUseCase(request, response, new UserRepository());
  }
}
