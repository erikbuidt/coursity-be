import type { LoginDTO } from "./dto/login.dto"

export class AuthService {
  async loginByGoogle(LoginDTO: LoginDTO) {
    console.log(LoginDTO)
    return "success"
  }
}
