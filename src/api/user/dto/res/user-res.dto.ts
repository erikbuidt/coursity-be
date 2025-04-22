import { User } from "@/entity/user.entity"
import { OmitType } from "@nestjs/swagger"

export class UserRes extends OmitType(User, ["password"] as const) {}
