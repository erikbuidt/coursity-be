import { Test, type TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { PrismaService } from "../../modules/prisma/prisma.service"
import { PermitService } from "../../modules/permit-io/permit.service"

describe("UserService", () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: {} }, { provide: PermitService, useValue: {} }],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
