import type { users } from "../../../../generated/prisma/client"

export type UserRes = Omit<users, "password">
