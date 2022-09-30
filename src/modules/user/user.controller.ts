import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async profile(@Request() request: any) {
    const user = await this.userService.findById(request.user.id);
    return user;
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Request() request: any,
    @Body() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (request.file) {
      user.photo_url = file.filename;
    }
    const formatedUser = JSON.parse(JSON.stringify(user));
    return await this.userService.editOne(request.user.id, formatedUser);
  }
}
