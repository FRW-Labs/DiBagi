import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WebResponse } from '../model/web.model';
import { LoginResponse, UserResponse } from '../model/response/user.response';
import { LoginRequest, RegisterRequest } from '../model/request/auth.request';
import { RefreshTokenGuard } from '../common/refresh-token.service';
import { Auth } from '../common/user.decorator';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from '../common/jwt.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 409, description: 'User Already Exists' })
  @ApiResponse({
    status: 201,
    description: 'User Registered Successfully',
    type: WebResponse<UserResponse>,
  })
  async register(
    @Body() registerDto: RegisterRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.authService.register(registerDto);
    return {
      data: user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 401, description: 'Incorrect authentication' })
  @ApiResponse({
    status: 200,
    description: 'User Login Successfully',
    type: WebResponse<LoginResponse>,
  })
  async login(
    @Body() loginDto: LoginRequest,
  ): Promise<WebResponse<LoginResponse>> {
    const tokens = await this.authService.login(loginDto);
    return {
      data: tokens,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Get a new access token using a refresh token' })
  async refresh(
    @Auth() user: any,
  ): Promise<WebResponse<{ accessToken: string }>> {
    const userId = user.sub;
    const refreshToken = user.refreshToken;

    const newAccessToken = await this.authService.refreshToken(
      userId,
      refreshToken,
    );
    return {
      data: newAccessToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout a user' })
  async logout(@Auth() user: User): Promise<WebResponse<string>> {
    await this.authService.logout(user.UserId);
    return {
      data: 'Logged out successfully',
    };
  }
}
