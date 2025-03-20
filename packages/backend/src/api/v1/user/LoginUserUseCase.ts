import { Request, Response } from 'express';
import { BaseUseCase } from '../../BaseUseCase.js';
import DateUtil from '../../../core/dateUtil/DateUtil.js';
import { userLoginRequestSchema, UserLoginData, UserLoginRequest } from './types.js';
import { UserRepository } from '../../../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class LoginUserUseCase extends BaseUseCase<{}, {}, UserLoginRequest, {}, UserLoginData> {
  userRepository: UserRepository;
  dateUtil: DateUtil;

  constructor(
    request: Request<{}, {}, UserLoginRequest, {}>,
    response: Response,
    userRepository: UserRepository,
    dateUtil: DateUtil
  ) {
    super(request, response);
    this.userRepository = userRepository;
    this.dateUtil = dateUtil;
  }

  async validate() {
    this.request.body = userLoginRequestSchema.parse(this.request.body);
  }

  async execute() {
    try {
      const user = await this.userRepository.findByEmail(this.request.body.email);
      if (!user) {
        throw new Error("User dosen't exist. Please Sign Up!!");
      }

      const isMatch = await bcrypt.compare(this.request.body.password, user.dataValues.password);
      if (!isMatch) {
        throw new Error('Invalid Credentails');
      }

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
      throw error;
    }
  }

  static create(request: Request<{}, {}, UserLoginRequest, {}>, response: Response) {
    return new LoginUserUseCase(request, response, new UserRepository(), new DateUtil());
  }
}
