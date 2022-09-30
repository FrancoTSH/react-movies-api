import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(email: string, password: string): Promise<any> {
    const { password: userPassword, ...user } =
      await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException();
    if (!(await compare(password, userPassword)))
      throw new UnauthorizedException();

    return user;
  }

  private async generateTokens(userId: number) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.userService.editOne(userId, {
      refresh_token: hashedRefreshToken,
    });
    return { accessToken, refreshToken };
  }

  async login(user: User) {
    const currentUser = await this.validateUser(user.email, user.password);
    if (currentUser) {
      const { accessToken, refreshToken } = await this.generateTokens(
        currentUser.id,
      );
      return {
        accessToken,
        refreshToken,
        user: currentUser,
      };
    }
  }

  async registerUser(user: User) {
    if (await this.userService.findByEmail(user.email)) {
      return new BadRequestException('Email already exists');
    }
    const { id, name, email } = await this.userService.create(user);
    const { accessToken, refreshToken } = await this.generateTokens(id);
    return {
      accessToken,
      refreshToken,
      user: { id, name, email },
    };
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decodedToken = this.jwtService.decode(refreshToken) as {
        sub: number;
      };
      const user = await this.userService.getRefreshToken(decodedToken.sub);
      const isRefreshTokenMatching = await compare(
        refreshToken,
        user.refresh_token,
      );
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      return this.generateTokens(decodedToken.sub);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  async removeRefreshToken(userId: number) {
    return await this.userService.editOne(userId, {
      refresh_token: null,
    });
  }
}
