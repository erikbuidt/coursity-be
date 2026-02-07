// biome-ignore lint/style/useImportType: <explanation>
import { Injectable, OnModuleInit } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from "@nestjs/config"
import { Permit } from "permitio"

@Injectable()
export class PermitService implements OnModuleInit {
  private permitClient: Permit

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.permitClient = new Permit({
      token: this.configService.get<string>("PERMIT_API_KEY"),
      // For production, you'd likely use the Hybrid PDP model for low latency:
      // pdp: {
      //   url: this.configService.get<string>('PERMIT_PDP_URL'),
      // },
    })
  }

  getClient(): Permit {
    return this.permitClient
  }

  // Helper to ensure user is synced to Permit.io
  async syncUser(userId: string, email: string, firstName?: string, lastName?: string) {
    try {
      const user = await this.permitClient.api.users.get(userId)
      if (user.email !== email || user.first_name !== firstName || user.last_name !== lastName) {
        await this.permitClient.api.users.update(userId, {
          email: email,
          first_name: firstName,
          last_name: lastName,
        })
        console.log(`User ${userId} updated in Permit.io`)
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // User doesn't exist in Permit.io, create them
        await this.permitClient.api.users.create({
          key: userId,
          email: email,
          first_name: firstName,
          last_name: lastName,

          // You can also add more attributes here if needed for ABAC
          // attributes: { department: 'engineering' },
        })
        const defaultRole = "student" // Assign a default role for new users

        // 3. Assign the user a role within the determined tenant
        await this.assignRole(userId, defaultRole)
        console.log(`User ${userId} synced to Permit.io`)
      } else {
        console.error("Error syncing user to Permit.io:", error)
        throw error
      }
    }
  }

  // You might also have methods for assigning roles directly if your app
  // manages roles programmatically, e.g., for user onboarding or admin panels.
  async assignRole(userId: string, roleKey: string, tenantKey: string = "default") {
    await this.permitClient.api.users.assignRole({
      user: userId,
      role: roleKey,
      tenant: tenantKey,
    })
    console.log(`Role ${roleKey} assigned to user ${userId} in tenant ${tenantKey}`)
    return true
  }

  async unassignRole(userId: string, roleKey: string, tenantKey: string = "default") {
    await this.permitClient.api.users.unassignRole({
      user: userId,
      role: roleKey,
      tenant: tenantKey,
    })
    console.log(`Role ${roleKey} unassigned from user ${userId} in tenant ${tenantKey}`)
  }

  async deleteUser(userId: string) {
    await this.permitClient.api.users.delete(userId)
    console.log(`User ${userId} deleted from Permit.io`)
  }
}
