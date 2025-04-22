import { Controller, Get, Param, Query, Delete, HttpCode, HttpStatus, Post, Body, UseGuards, Put } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { UserService } from "./user.service"
import type { User } from "@/entity/user.entity"
import type { UserQueryDto } from "./dto/user-query.dto"
import type { CreateClerkUser } from "./dto/req/create-clerk-user.dto"
import { ApiKeyGuard } from "@/common/guards/api-key.guard"
import { UserRes } from "./dto/res/user-res.dto"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":userId")
  getUserById(@Param("userId") userId: number): Promise<User | null> {
    return this.userService.getUserById(userId)
  }

  @Get()
  getUsers(@Query() query: UserQueryDto) {
    return this.userService.getUsers(query.page, query.limit)
  }

  @Delete(":userId")
  @HttpCode(HttpStatus.OK)
  async deleteUserById(@Param("userId") userId: number): Promise<{ message: string }> {
    await this.userService.deleteUserById(userId)
    return { message: `User with id ${userId} deleted successfully` }
  }

  async createUser(user: User): Promise<User> {
    return this.userService.createUser(user)
  }

  async updateUser(userId: number, user: User): Promise<User | null> {
    return this.userService.updateUser(userId, user)
  }

  @Post("create-clerk-user")
  @UseGuards(ApiKeyGuard)
  async createUserFromClerk(@Body() data: CreateClerkUser): Promise<User> {
    return this.userService.createClerkUser(data)
  }

  @Put("/update-clerk-user")
  @UseGuards(ApiKeyGuard)
  async updateUserFromClerk(@Body() data: Partial<CreateClerkUser>): Promise<string> {
    return this.userService.updateClerkUser(data)
  }

  @Delete("/delete-clerk-user/:clerkUserId")
  @UseGuards(ApiKeyGuard)
  async deleteUserFromClerk(@Param("clerkUserId") clerkUserId: string): Promise<string> {
    return this.userService.deleteClerkUser(clerkUserId)
  }
}
