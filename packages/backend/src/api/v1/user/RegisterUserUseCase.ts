import { Request, Response } from 'express';
import { BaseUseCase } from '../../BaseUseCase.js';
import DateUtil from '../../../core/dateUtil/DateUtil.js';
import { UserRegisterData, UserRegisterRequest, userRegisterRequestSchema } from './types.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../../../core/logger/logger.js';

export class RegisterUserUseCase extends BaseUseCase<{}, {}, UserRegisterRequest, {}, UserRegisterData> {
  userRepository: UserRepository;
  dateUtil: DateUtil;

  constructor(
    request: Request<{}, {}, UserRegisterRequest, {}>,
    response: Response,
    userRepository: UserRepository,
    dateUtil: DateUtil
  ) {
    super(request, response);
    this.userRepository = userRepository;
    this.dateUtil = dateUtil;
  }

  async validate() {
    this.request.body = userRegisterRequestSchema.parse(this.request.body);
  }

  async execute() {
    let user;
    try {
      user = await this.userRepository.findByEmail(this.request.body.email);

      if (user) {
        throw new Error('User already exists. Please login');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.request.body.password, salt);

      user = await this.userRepository.add({
        email: this.request.body.email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { id: user.dataValues.id, email: user.dataValues.email },
        process.env.JWT_SECRET || 'some_jwt_secret',
        {
          expiresIn: '1h',
        }
      );

      return {
        token,
      };
    } catch (error) {
      logger.error('RegisterUserUseCase.execute() error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, UserRegisterRequest, {}>, response: Response) {
    return new RegisterUserUseCase(request, response, new UserRepository(), new DateUtil());
  }
}
