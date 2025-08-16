import {
  BadRequestException, ConflictException,
  Inject,
  Injectable,
  NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { LoginResponse, UserResponse } from '../model/response/user.response';
import { SearchUserDto } from '../model/request/user.request';
import { UserRepository } from './user.repository';
import { LoginRequest, RegisterRequest } from '../model/request/auth.request';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
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

  async search(searchDto: SearchUserDto): Promise<UserResponse> {
    const {username, email} = searchDto;
    if (username) {
      return this.findByUsername(username);
    }
    if (email) {
      return this.findByEmail(email);
    }

    throw new BadRequestException("Username and email must be provided");
  }

  async findById(userId: number): Promise<UserResponse> {
    // 1. Check if userID is valid
    if (!userId || userId <= 0) {
      throw new BadRequestException('User ID tidak valid.');
    }

    // 2. Call repository layer
    const foundedUser = await this.userRepository.findById(userId);
    if (!foundedUser) {
      throw new NotFoundException(`User dengan ID ${userId} tidak ditemukan.`);
    }

    // 3. Convert entity to response
    return UserResponse.convertToResponse(foundedUser);
  }

  async findByUsername(username: string): Promise<UserResponse> {
    // 1. Check if username is valid
    if (!username) {
      throw new BadRequestException('Username tidak boleh kosong.');
    }

    // 2. Call repository layer
    const foundedUser = await this.userRepository.findByUsername(username);
    if (!foundedUser) {
      throw new NotFoundException(`User dengan username ${username} tidak ditemukan.`);
    }

    // 3. Convert entity to response
    return UserResponse.convertToResponse(foundedUser);
  }

  async findByEmail(email: string): Promise<UserResponse> {
    // 1. Check if email is valid
    if (!email) {
      throw new BadRequestException('Email tidak boleh kosong.');
    }

    // 2. Call repository layer
    const foundedUser = await this.userRepository.findByEmail(email);
    if (!foundedUser) {
      throw new NotFoundException(`User dengan email ${email} tidak ditemukan.`);
    }

    // 3. Convert entity to response
    return UserResponse.convertToResponse(foundedUser);
  }
}