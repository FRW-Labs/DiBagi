import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserRepository,
    PrismaService,
  ],
  exports: [
    UserRepository,
  ]
})
export class UserModule {}