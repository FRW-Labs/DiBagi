import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repository/i-user.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, RegisterRequest, } from '../dto/create-user.dto';
import { LoginResponse, UserResponse } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
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
      return await this.userRepository.save(userEntity);
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
    const payload = { sub: user.UserID, username: user.Username }
    const accessToken = await this.jwtService.signAsync(payload);

    // 4. convert to response and return it
    return LoginResponse.convertToResponse(accessToken);
  }
}