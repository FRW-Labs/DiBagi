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
import { UserService } from './user.service';
import { UserResponse } from '../model/response/user.response';
import { SearchUserDto } from '../model/request/user.request';
import { JwtAuthGuard } from '../common/jwt.service';
import { WebResponse } from '../model/web.model';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
