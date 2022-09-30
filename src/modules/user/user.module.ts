import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { storageConfig } from 'src/config/storage.config';

@Module({
  providers: [UserService],
  imports: [MulterModule.registerAsync(storageConfig)],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
