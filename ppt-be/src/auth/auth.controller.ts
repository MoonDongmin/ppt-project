import { Controller, Post, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategy/local.strategy';
import { Authorization } from 'src/common/decorator/authorization.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req) {
  //   const { password, ...user } = req.user;

  //   return user;
  // }

  @Post('login')
  async login(@Authorization() rawToken: string) {
    return this.authService.login(rawToken);
  }

  @Post('register')
  register(@Authorization() rawToken: string) {
    return this.authService.register(rawToken);
  }
}
