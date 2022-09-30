import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

interface IUser {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  async findById(id: number): Promise<User> {
    const user = await User.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await User.createQueryBuilder('user')
      .where({ email })
      .addSelect('user.password')
      .getOne();
    return user;
  }

  async create(user: IUser) {
    const newUser = await User.create(user).save();
    return newUser;
  }

  async editOne(id: number, userEntity?: any) {
    await User.update(id, userEntity);
    return await User.findOne(id);
  }

  async getRefreshToken(id: number) {
    return await User.findOne(id, { select: ['refresh_token'] });
  }
}
