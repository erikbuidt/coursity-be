import { Controller } from "@nestjs/common"
import { LoginDTO } from "./dto/login.dto"
import { User } from "@/entity/user.entity"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  async loginByGoogle(credentials: LoginDTO): Promise<string> {
    return this.authService.loginByGoogle(credentials)
  }
}
