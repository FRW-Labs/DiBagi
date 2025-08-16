import { GroupRepository } from './group.repository';
import { PrismaService } from '../common/prisma.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GroupResponse } from '../model/response/group.response';
import { UserResponse } from '../model/response/user.response';
import { Group } from '../entity/group.entity';
import { CreateGroupRequest } from '../model/request/group.request';
import { User } from '../entity/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @Inject(GroupRepository) private readonly groupRepository: GroupRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(req: CreateGroupRequest, creator: UserResponse): Promise<GroupResponse> {
    // 1. convert request to entity
    const newGroupEntity = Group.new({
      Name: req.name,
      Description: req.description ?? null,
      CreatedBy: creator.Username
    })

    // 2. start transaction
    const savedGroup = await this.groupRepository.create(newGroupEntity, creator.UserId)

    // 6. convert entity to response and return it
    return GroupResponse.convertToResponse(savedGroup)
  }

  async invite(groupId: number, userId: number, authUser: UserResponse): Promise<GroupResponse> {
    // 1. start transaction
    const updatedGroup = await this.prisma.$transaction(async (tx) => {
      // 2. get group first
      const groupEntity = await this.groupRepository.getGroupById(groupId);
      if (!groupEntity) {
        throw new NotFoundException(`Group dengan ID ${groupId} tidak ditemukan.`);
      }

      // 3. run authorization layer (only admin can invite)
      if (groupEntity.CreatedBy !== authUser.Username) {
        throw new UnauthorizedException('Hanya pembuat grup yang bisa mengundang anggota.');
      }

      // 4. run the addMember() logic on group entity
      groupEntity.addMember(userId);

      // 5. call repository
      await this.groupRepository.invite(groupId, userId, tx)

      // 6. return entity
      return groupEntity
    })

    // 7. convert to response
    return GroupResponse.convertToResponse(updatedGroup)
  }

  async getGroupById(groupId: number): Promise<GroupResponse> {
    // 1. check if groupId is valid
    if (!groupId || groupId < 0) {
      throw new BadRequestException('Group ID tidak valid.');
    }

    // 2. call repository layer
    const foundedGroup = await this.groupRepository.getGroupById(groupId);
    if (!foundedGroup) throw new NotFoundException(`Group dengan ID ${groupId} tidak ditemukan.`);

    // 3. convert entity to response
    return GroupResponse.convertToResponse(foundedGroup);
  }
}