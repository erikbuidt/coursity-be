import { Controller, Get, Param } from '@nestjs/common'
// biome-ignore lint/style/useImportType: <explanation>
import { UserService } from './user.service'
import type { User } from '@/entity/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  @Get(':userId')
  getUserById(@Param('userId') userId: number): Promise<User| null> {
    return this.userService.getUserById(userId);
  }
}
