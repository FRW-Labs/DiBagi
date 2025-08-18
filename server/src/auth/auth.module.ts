import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { JwtStrategy } from '../common/jwt.service';
import { RefreshTokenStrategy } from '../common/refresh-token.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    UserRepository,
    AuthRepository,
    PrismaService,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}