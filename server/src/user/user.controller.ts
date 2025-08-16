import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginResponse, UserResponse } from '../model/response/user.response';
import { SearchUserDto } from '../model/request/user.request';
import { JwtAuthGuard } from '../common/jwt.service';
import { LoginRequest, RegisterRequest } from '../model/request/auth.request';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'User Registered Successfully',
    type: UserResponse,
  })
  @ApiResponse({ status: 409, description: 'User Already Exists' })
  async register(@Body() registerDto: RegisterRequest): Promise<UserResponse> {
    return this.userService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 201,
    description: 'User Login Successfully',
    type: LoginResponse,
  })
  @ApiResponse({ status: 401, description: 'Incorrect authentication' })
  async login(@Body() loginDto: LoginRequest): Promise<LoginResponse> {
    return this.userService.login(loginDto);
  }

  // users/3
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get user with user id' })
  @ApiResponse({ status: 400, description: 'User does not exist' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponse })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    return this.userService.findById(id);
  }

  // users/search?username=johndoe
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('search')
  @ApiOperation({ summary: 'Get user with username or email' })
  @ApiResponse({ status: 400, description: 'User does not exist' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponse })
  async searchUser(
    @Query() searchUserDto: SearchUserDto,
  ): Promise<UserResponse> {
    return this.userService.search(searchUserDto);
  }
}
