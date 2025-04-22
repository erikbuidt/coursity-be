import { APP_ERROR } from "@/common/errors/app.error"
import { AppException } from "@/common/errors/exception.error"
import { User } from "@/entity/user.entity"
import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import type { CreateClerkUser } from "./dto/req/create-clerk-user.dto"
import { UserRes } from "./dto/res/user-res.dto"

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @throws BadRequestException if the ID is invalid.
   * @throws AppException if the user is not found.
   * @returns The user entity.
   */
  async getUserById(id: number) {
    if (!id || id <= 0) {
      this.logger.warn(`Invalid user ID provided: ${id}`)
      throw new BadRequestException("Invalid user ID")
    }
    this.logger.log(`Fetching user with ID: ${id}`)
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ["courseProgress", "enrollments"],
      })
      if (!user) {
        this.logger.warn(`User not found with ID: ${id}`)
        throw new AppException(APP_ERROR.USER_NOT_FOUND)
      }
      this.logger.log(`User found with ID: ${id}`)
      return user
    } catch (error) {
      this.logger.error(`Error fetching user with ID: ${id}`, error.stack)
      throw error
    }
  }

  async getUsers(page: number = 0, limit: number = 10) {
    const users = await this.userRepository.find({
      skip: page * limit,
      take: limit,
      relations: ["courseProgress", "enrollments"],
    })
    return users
  }

  async deleteUserById(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id)
      if (result.affected === 0) {
        this.logger.warn(`No user found to delete with ID: ${id}`)
        throw new AppException(APP_ERROR.USER_NOT_FOUND)
      }
      this.logger.log(`User deleted with ID: ${id}`)
    } catch (error) {
      this.logger.error(`Error deleting user with ID: ${id}`, error.stack)
      throw error
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      const newUser = this.userRepository.create(user)
      const savedUser = await this.userRepository.save(newUser)
      this.logger.log(`User created with ID: ${savedUser.id}`)
      return savedUser
    } catch (error) {
      this.logger.error("Error creating user", error.stack)
      throw error
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      await this.userRepository.update(id, user)
      const updatedUser = await this.getUserById(id)
      this.logger.log(`User updated with ID: ${updatedUser.id}`)
      return updatedUser
    } catch (error) {
      this.logger.error(`Error updating user with ID: ${id}`, error.stack)
      throw error
    }
  }

  async createClerkUser(createClerkUser: CreateClerkUser): Promise<User> {
    try {
      await this.userRepository.upsert(createClerkUser, ["clerk_user_id"])
      const user = await this.userRepository.findOne({
        where: { clerk_user_id: createClerkUser.clerk_user_id },
      })
      if (!user) throw new Error("User not found after upsert")
      return user
    } catch (error) {
      this.logger.error(`Error syncing user with clerk_user_id: ${createClerkUser.clerk_user_id}`, error.stack)
      throw error
    }
  }

  async updateClerkUser(updateClerkUser: Partial<CreateClerkUser>): Promise<string> {
    const { clerk_user_id, ...updatedData } = updateClerkUser
    await this.userRepository.update({ clerk_user_id }, updatedData)
    return "success"
  }

  async deleteClerkUser(clerk_user_id: string) {
    await this.userRepository.delete({
      clerk_user_id,
    })
    return "success"
  }
}
