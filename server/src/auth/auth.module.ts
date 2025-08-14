import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from './application/controller/auth.controller';
import { UserController } from './application/controller/user.controller';

// Application Services
import { AuthService } from './application/service/auth.service';
import { UserService } from './application/service/user.service';

// Repository (Interface & Implementation)
import { IUserRepository } from "./domain/repository/i-user.repository"
import { UserRepository } from "./infrastructure/repository/user.repository"

// Infrastructure & Guards
import { PrismaService } from './infrastructure/database/prisma.service';
import { JwtStrategy } from './infrastructure/guards/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'JKOb7uA7H7DTP14',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AuthController,
    UserController,
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    PrismaService,
    JwtStrategy,
  ],
  exports: [
    AuthService,
    UserService,
  ],
})
export class AuthModule {}