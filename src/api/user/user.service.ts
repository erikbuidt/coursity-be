import { APP_ERROR } from "@/common/errors/app.error"
import { AppException } from "@/common/errors/exception.error"
import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import type { CreateClerkUser } from "./dto/req/create-clerk-user.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { PermitService } from "@/modules/permit-io/permit.service"
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@/modules/prisma/prisma.service"
import type { users } from "../../generated/prisma/client"

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly permitService: PermitService,
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
      const user = await this.prisma.users.findFirst({
        where: { id, deleted_at: null },
        include: { course_progress: true, enrollments: true },
      })
      if (!user) {
        this.logger.warn(`User not found with ID: ${id}`)
        throw new AppException(APP_ERROR.USER_NOT_FOUND)
      }
      this.logger.log(`User found with ID: ${id}`)
      return user
    } catch (error) {
      this.logger.error(`Error fetching user with ID: ${id}`, (error as Error).stack)
      throw error
    }
  }

  async getUsers(page = 0, limit = 10) {
    const users = await this.prisma.users.findMany({
      skip: page * limit,
      take: limit,
      where: { deleted_at: null },
      include: { course_progress: true, enrollments: true },
    })
    return users
  }

  async deleteUserById(id: number): Promise<void> {
    try {
      const result = await this.prisma.users.updateMany({
        where: { id },
        data: { deleted_at: new Date() },
      })
      if (result.count === 0) {
        this.logger.warn(`No user found to delete with ID: ${id}`)
        throw new AppException(APP_ERROR.USER_NOT_FOUND)
      }
      this.logger.log(`User deleted with ID: ${id}`)
    } catch (error) {
      this.logger.error(`Error deleting user with ID: ${id}`, (error as Error).stack)
      throw error
    }
  }

  async createUser(user: Omit<users, "id" | "created_at" | "updated_at">): Promise<users> {
    try {
      const savedUser = await this.prisma.users.create({
        data: user,
      })
      this.logger.log(`User created with ID: ${savedUser.id}`)
      return savedUser
    } catch (error) {
      this.logger.error("Error creating user", (error as Error).stack)
      throw error
    }
  }

  async updateUser(id: number, user: Partial<users>): Promise<users> {
    try {
      await this.prisma.users.update({
        where: { id },
        data: user,
      })
      const updatedUser = await this.getUserById(id)
      this.logger.log(`User updated with ID: ${updatedUser.id}`)
      return updatedUser
    } catch (error) {
      this.logger.error(`Error updating user with ID: ${id}`, (error as Error).stack)
      throw error
    }
  }

  async createClerkUser(createClerkUser: CreateClerkUser): Promise<users> {
    try {
      // Upsert user by email
      const user = await this.prisma.users.upsert({
        where: { email: createClerkUser.email },
        update: {
          ...createClerkUser,
          deleted_at: null, // Restore if was soft-deleted
        },
        create: createClerkUser,
      })

      await this.permitService.syncUser(
        user.id.toString(),
        createClerkUser.email,
        createClerkUser.full_name.split(" ")[0],
        createClerkUser.full_name.split(" ")[1],
      )
      return user
    } catch (error) {
      this.logger.error(`Error syncing user with clerk_user_id: ${createClerkUser.clerk_user_id}`, (error as Error).stack)
      throw error
    }
  }

  async updateClerkUser(updateClerkUser: Partial<CreateClerkUser>): Promise<string> {
    const { clerk_user_id, ...updatedData } = updateClerkUser
    await this.prisma.users.updateMany({
      where: { clerk_user_id },
      data: updatedData,
    })

    const user = await this.prisma.users.findFirst({ where: { clerk_user_id, deleted_at: null } })
    if (!user) throw new Error("User not found")
    await this.permitService.syncUser(user.id.toString(), user.email, user.full_name.split(" ")[0], user.full_name.split(" ")[1])
    return "success"
  }

  async deleteClerkUser(clerk_user_id: string) {
    console.log("deleteClerkUser", { clerk_user_id })
    const user = await this.prisma.users.findFirst({ where: { clerk_user_id, deleted_at: null } })
    if (!user) throw new Error("User not found")
    await this.prisma.users.update({
      where: { id: user.id },
      data: { deleted_at: new Date() },
    })
    await this.permitService.deleteUser(user.id.toString())
    return "success"
  }
}
