import { APP_ERROR } from '@/common/errors/app.error';
import { AppException } from '@/common/errors/exception.error';
import { User } from '@/entity/user.entity';
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import type{ Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    })
    if (!user) {
      throw new AppException(APP_ERROR.USER_NOT_FOUND);
    }
    return user;
  }
}
