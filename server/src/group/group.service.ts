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
    if (!groupId || groupId <= 0) {
      throw new BadRequestException('Group ID tidak valid.');
    }

    // 2. call repository layer
    const foundedGroup = await this.groupRepository.getGroupById(groupId);
    if (!foundedGroup) throw new NotFoundException(`Group dengan ID ${groupId} tidak ditemukan.`);

    // 3. convert entity to response
    return GroupResponse.convertToResponse(foundedGroup);
  }

  async getGroupsByUserId(authUser: UserResponse): Promise<GroupResponse[] | []> {
    // 1. call repository layer
    const foundedGroups = await this.groupRepository.getGroups(authUser.UserId)

    // 2. if there are no group, return an empty array
    if (!foundedGroups || foundedGroups.length === 0) return [];

    // 3. if there are group, return the groups
    return foundedGroups.map(group => GroupResponse.convertToResponse(group));
  }

  async update(groupId: number, req: CreateGroupRequest, authUser: UserResponse): Promise<GroupResponse> {
    // 1. start a transaction
    const updatedGroup = await this.prisma.$transaction(async (tx) => {

      // 2. authorization layer
      const groupToUpdate = await this.groupRepository.getGroupById(groupId);
      if (!groupToUpdate) {
        throw new NotFoundException(`Group dengan ID ${groupId} tidak ditemukan.`);
      }
      if (groupToUpdate.CreatedBy !== authUser.Username) {
        throw new UnauthorizedException('Hanya pembuat grup yang bisa update group')
      }

      // 3. convert request to entity
      const entityGroup = Group.from({
        GroupId: groupId,
        Name: req.name,
        Description: req.description ?? null,
        CreatedBy: groupToUpdate.CreatedBy,
        CreatedAt: groupToUpdate.CreatedAt,
      })

      // 4. call the repository and return the entity
      return await this.groupRepository.update(entityGroup, tx)
    })
    // 6. convert to response and return it
    return GroupResponse.convertToResponse(updatedGroup)
  }

  async removeMember(groupId: number, userId: number, authUser: UserResponse): Promise<string> {
    // 1. start transaction
    const updatedGroup = await this.prisma.$transaction(async (tx) => {

      // 2. check if group exists
      const targetGroup = await this.groupRepository.getGroupById(groupId);
      if (!targetGroup) {
        throw new NotFoundException(`Group dengan ID ${groupId} tidak ditemukan.`);
      }

      // 3. authorization layer
      if (targetGroup.CreatedBy !== authUser.Username) {
        throw new UnauthorizedException('Only admin can remove member!')
      }

      // 4. call repository layer and return it
      return await this.groupRepository.removeMember(groupId, userId, tx)
    })

    // 5. return success
    return `Removed user with id ${userId} from group ${groupId}`
  }

  async deleteGroup(groupId: number, authUser: UserResponse): Promise<string> {
    const updatedGroup = await this.prisma.$transaction(async (tx) => {
      const targetGroup = await this.groupRepository.getGroupById(groupId);
      if (!targetGroup) {
        throw new NotFoundException(`Group dengan ID ${groupId} tidak ditemukan.`);
      }

      if (targetGroup.CreatedBy !== authUser.Username) {
        throw new UnauthorizedException('Only admin can delete group')
      }

      return await this.groupRepository.deleteGroup(groupId, tx)
    })
    return `Deleted Group with Id ${groupId}`
  }

  // from member perspective
  async leaveGroup(groupId: number, authUser: UserResponse): Promise<string> {
    const updatedGroup = await this.prisma.$transaction(async (tx) => {
      const targetGroup = await this.groupRepository.getGroupById(groupId);
      if (!targetGroup) {
        throw new NotFoundException(`Group dengan ID ${groupId} tidak ditemukan.`);
      }

      if (!targetGroup.getMembers().includes(authUser.UserId)) {
        throw new BadRequestException('You are not the member of this group')
      }

      // TODO: Kalau user masih ada Bill yang belum di settle dalam Group, dia juga gabisa keluar

      if (targetGroup.CreatedBy === authUser.Username) {
        throw new UnauthorizedException('Admin can not leave group, admin better delete the group instead')
      }

      return await this.groupRepository.removeMember(groupId, authUser.UserId, tx)
    })
    return `Leaved Group with Id ${groupId}`
  }
}