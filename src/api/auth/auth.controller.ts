import { Controller } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { LoginDTO } from "./dto/login.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  async loginByGoogle(credentials: LoginDTO): Promise<string> {
    return this.authService.loginByGoogle(credentials)
  }
}
