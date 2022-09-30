import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: User) {
    const data = await this.authService.login(user);
    return data;
  }

  @Post('register')
  async register(@Body() user: User) {
    const newUser = await this.authService.registerUser(user);
    return newUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() request: any) {
    await this.authService.removeRefreshToken(request.user.id);
    return { success: true };
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() body: { refreshToken: string }) {
    const tokens = await this.authService.createAccessTokenFromRefreshToken(
      body.refreshToken,
    );
    return tokens;
  }
}
