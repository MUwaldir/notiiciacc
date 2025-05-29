import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    console.log(email, ' :', password);
    return this.authService.signIn(email, password);
  }
  @Post('google')
  async googleLogin(@Body() body: GoogleLoginDto) {
    return this.authService.loginWithGoogle(body.idToken);
  }
  
}
