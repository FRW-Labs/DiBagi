import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResponse, UserResponse } from '../model/response/user.response';
import { LoginRequest, RegisterRequest } from '../model/request/auth.request';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(req: RegisterRequest): Promise<UserResponse> {
    // 1. start transaction
    const createdUserEntity = await this.prisma.$transaction(async (tx) => {

      // 2. check for duplicate key value
      const existingUsername = await this.userRepository.findByUsername(req.username)
      if (existingUsername) {
        throw new ConflictException(`Username ${req.username} already exists!`);
      }
      const existingEmail = await this.userRepository.findByEmail(req.email)
      if (existingEmail) {
        throw new ConflictException(`Email ${req.email} already exists!`);
      }

      // 3. hash password
      const hashedPassword = await bcrypt.hash(req.password, 10)

      // 4. convert request to entity
      const userEntity = User.create({
        UserID: 0, // sementara nilai default karena bakal otomatis dibuatin sama database
        Username: req.username,
        Name: req.name,
        Email: req.email,
        Password: hashedPassword,
      })

      // 5. call the repository layer and return it
      return await this.authRepository.save(userEntity);
    })

    // 7. after committing transaction (convert entity to response) and return it
    return UserResponse.convertToResponse(createdUserEntity);
  }

  async login(req: LoginRequest): Promise<LoginResponse> {
    // 1. find user by username
    const user = await this.userRepository.findByUsername(req.username)
    if (!user) {
      throw new UnauthorizedException('wrong username')
    }

    // 2. check password
    const isPasswordMatching = await bcrypt.compare(req.password, user.Password)
    if (!isPasswordMatching) {
      throw new UnauthorizedException('wrong password')
    }

    // 3. generate token
    const payload = { sub: user.UserId, username: user.Username }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      })
    ])

    // 4. hash & store refresh token to DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await this.authRepository.updateRefreshToken(user.UserId, hashedRefreshToken)

    // 4. convert to response and return it
    return LoginResponse.convertToResponse(accessToken, refreshToken);
  }

  async logout(userId: number): Promise<void> {
    await this.authRepository.updateRefreshToken(userId, null)
  }

  async refreshToken(userId: number, refreshToken: string): Promise<{ accessToken: string }> {
    if (refreshToken === '') {
      throw new UnauthorizedException('Need a refresh token.');
    }

    const user = await this.userRepository.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException(`Access Denied for user with id ${userId}`);
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken)
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(`Refresh Denied for user with id ${userId}`);
    }

    const payload = { sub: user.UserId, username: user.Username };
    const newAccessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    return { accessToken: newAccessToken };
  }
}