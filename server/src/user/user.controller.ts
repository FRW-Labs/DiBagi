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
import { WebResponse } from '../model/web.model';

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
  @ApiResponse({ status: 201, description: 'User Registered Successfully', type: WebResponse<UserResponse> })
  async register(@Body() registerDto: RegisterRequest): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.register(registerDto);
    return {
      data: user,
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 201,
    description: 'User Login Successfully',
    type: LoginResponse,
  })
  @ApiResponse({ status: 401, description: 'Incorrect authentication' })
  @ApiResponse({ status: 200, description: 'User Login Successfully', type: WebResponse<LoginResponse> })
  async login(@Body() loginDto: LoginRequest): Promise<WebResponse<string>> {
    const user = await this.userService.login(loginDto);
    return {
      data: user.Token,
    }
  }

  // users/search?username=johndoe
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('search')
  @ApiOperation({ summary: 'Get user with username or email' })
  @ApiResponse({ status: 400, description: 'User does not exist' })
  @ApiResponse({ status: 200, description: 'User found', type: WebResponse<UserResponse> })
  async searchUser(
    @Query() searchUserDto: SearchUserDto,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.search(searchUserDto);
    return {
      data: user,
    }
  }

  // users/3
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get user with user id' })
  @ApiResponse({ status: 400, description: 'User does not exist' })
  @ApiResponse({ status: 200, description: 'User found', type: WebResponse<UserResponse> })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.findById(id);
    return {
      data: user,
    }
  }
}
