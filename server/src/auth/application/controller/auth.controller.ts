import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest, RegisterRequest } from '../dto/create-user.dto';
import { LoginResponse, UserResponse } from '../dto/user.dto';
import { AuthService } from '../service/auth.service';

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Register')
  @ApiOperation({summary: "Register a user"})
  @ApiResponse({ status: 201, description: "User Registered Successfully", type: UserResponse })
  @ApiResponse({ status: 409, description: "User Already Exists"})
  async register(@Body() registerDto: RegisterRequest): Promise<UserResponse> {
    return this.authService.register(registerDto);
  }

  @Post('Login')
  @ApiOperation({summary: "Login a user"})
  @ApiResponse({ status: 201, description: "User Login Successfully", type: LoginResponse })
  @ApiResponse({ status: 401, description: "Incorrect authentication"})
  async login(@Body() loginDto: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }
}