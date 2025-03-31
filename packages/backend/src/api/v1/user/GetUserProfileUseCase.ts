import { Request, Response } from 'express';
import { BaseUseCase } from '../../BaseUseCase.js';
import { UserProfileData } from './types.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import { logger } from '../../../core/logger/logger.js';

export class GetUserProfileUseCase extends BaseUseCase<{}, {}, {}, {}, UserProfileData> {
  userRepository: UserRepository;

  constructor(request: Request<{}, {}, {}, {}>, response: Response, userRepository: UserRepository) {
    super(request, response);
    this.userRepository = userRepository;
  }

  async validate() {}

  async execute() {
    let user: any;
    try {
      user = await this.authenticate();

      return {
        email: user.email,
      };
    } catch (error) {
      logger.error('GetUserProfileUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, {}, {}>, response: Response) {
    return new GetUserProfileUseCase(request, response, new UserRepository());
  }
}
