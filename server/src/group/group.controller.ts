import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { WebResponse } from '../model/web.model';
import { GroupResponse } from '../model/response/group.response';
import { CreateGroupRequest, InviteUserDto } from '../model/request/group.request';
import { JwtAuthGuard } from '../common/jwt.service';
import { Auth } from '../common/user.decorator'
import { UserResponse } from '../model/response/user.response';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Create new group', type: WebResponse<GroupResponse> })
  @ApiResponse({ status: 500, description: 'An error occured' })
  async create(@Body() createGroupRequest:CreateGroupRequest, @Auth() user: UserResponse): Promise<WebResponse<GroupResponse>> {
    const group = await this.groupService.create(createGroupRequest, user)
    return {
      data: group,
    }
  }

  @Post(':groupId/invite')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Invite a new member to a group' })
  @ApiResponse({ status: 201, description: 'Invite a new member to a group', type: WebResponse<GroupResponse> })
  @ApiResponse({ status: 404, description: 'Group or User not found' })
  async invite(@Param('groupId', ParseIntPipe) groupId: number, @Body() inviteDto: InviteUserDto, @Auth() user: UserResponse): Promise<WebResponse<GroupResponse>> {
    const updatedGroup = await this.groupService.invite(groupId, inviteDto.userId, user)
    return {
      data: updatedGroup,
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get group with id' })
  @ApiResponse({ status: 400, description: 'Group does not exist' })
  @ApiResponse({ status: 200, description: 'Group found', type: WebResponse<GroupResponse> })
  async getGroupById(@Param('id', ParseIntPipe) id: number): Promise<WebResponse<GroupResponse>> {
    const group = await this.groupService.getGroupById(id)
    return {
      data: group,
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get groups for users' })
  @ApiResponse({ status: 400, description: 'User did not join any group' })
  @ApiResponse({ status: 200, description: 'Groups retrieved', type: WebResponse<GroupResponse[]> })
  async getGroupsByUserId(@Auth() user: UserResponse): Promise<WebResponse<GroupResponse[]>> {
    const groups = await this.groupService.getGroupsByUserId(user)

    return {
      data: groups,
    }
  }

  @Put(':groupId/update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update group with Id ${groupId}' })
  @ApiResponse({ status: 200, description: 'Update group with Id ${groupId}', type: WebResponse<GroupResponse> })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(@Param('groupId', ParseIntPipe) groupId: number, @Body() createGroupRequest: CreateGroupRequest, @Auth() user: UserResponse): Promise<WebResponse<GroupResponse>> {
    const updatedGroup = await this.groupService.update(groupId, createGroupRequest, user)

    return {
      data: updatedGroup,
    }
  }

  @Put(':groupId/remove-member/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove member from the group' })
  @ApiResponse({ status: 200, description: 'Remove member from group', type: WebResponse<string> })
  @ApiResponse({ status: 404, description: 'Group or User not found' })
  async removeMember(@Param('groupId', ParseIntPipe) groupId: number, @Param('userId', ParseIntPipe) userId: number, @Auth() user: UserResponse): Promise<WebResponse<string>> {
    const updatedGroup = await this.groupService.removeMember(groupId, userId, user)

    return {
      data: updatedGroup,
    }
  }

  @Delete(':groupId/delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete group with Id ${groupId}' })
  @ApiResponse({ status: 200, description: 'Delete Group', type: WebResponse<string> })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async deleteGroup(@Param('groupId', ParseIntPipe) groupId: number, @Auth() user: UserResponse): Promise<WebResponse<string>> {
    const deletedGroup = await this.groupService.deleteGroup(groupId, user)

    return {
      data: deletedGroup,
    }
  }
}