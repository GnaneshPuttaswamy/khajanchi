import { UserModel } from '../models/UserModel.js';
import { BaseRepository } from './BaseRepository.js';

export class UserRepository extends BaseRepository<UserModel> {
  model() {
    return UserModel;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return UserModel.findOne({
      where: {
        email,
      },
    });
  }
}
