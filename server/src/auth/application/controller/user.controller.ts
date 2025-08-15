import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserResponse } from '../dto/user.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guards';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
