import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from '../common/prisma.service';
import { JwtStrategy } from '../common/jwt.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserRepository,
    },
    PrismaService,
    JwtStrategy,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}