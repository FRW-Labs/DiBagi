import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { Group } from '../entity/group.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupRepository {
  // inisialisasi prisma service
  constructor(private readonly prisma: PrismaService) {}

  async create(group: Group, creatorId: number, tx?: Prisma.TransactionClient): Promise<Group> {
    // 1. use transaction client
    const prismaClient = tx || this.prisma;

    const dataToSave = {
      Name: group.Name,
      Description: group.Description,
      Creator: {
        connect: {
          Username: group.CreatedBy,
        }
      },
      Members: {
        create: [
          {
            User: {
              connect: { UserID: creatorId },
            },
          },
        ],
      },
    }

    const createdGroupFromDB = await prismaClient.group.create({
      data: dataToSave,
    })

    return Group.from({
      GroupId: createdGroupFromDB.GroupID,
      Name: createdGroupFromDB.Name,
      Description: createdGroupFromDB.Description,
      CreatedBy: createdGroupFromDB.CreatedByUser,
      CreatedAt: createdGroupFromDB.CreatedAt,
      userIds: [creatorId]
    })
  }

  async getGroupById(groupId: number): Promise<Group | null> {
    const groupWithMembers = await this.prisma.group.findUnique({
      where: { GroupID: groupId },
      include: {
        Members: true,
      }
    })

    if (!groupWithMembers) {
      return null;
    }

    const memberIds = groupWithMembers.Members.map((member) => member.UserID)

    return Group.from({
      GroupId: groupWithMembers.GroupID,
      Name: groupWithMembers.Name,
      Description: groupWithMembers.Description,
      CreatedBy: groupWithMembers.CreatedByUser,
      CreatedAt: groupWithMembers.CreatedAt,
      userIds: memberIds
    })
  }

  async invite(groupId: number, userId: number, tx?: Prisma.TransactionClient): Promise<void> {
    const prismaClient = tx || this.prisma;
    const dataToSave = {
      User: {
        connect: { UserID: userId }
      },
      Group: {
        connect: { GroupID: groupId }
      }
    }

    // add member to group
    await prismaClient.groupMembers.create({ data: dataToSave })
  }

  async getGroups(userId: number): Promise<Group[]> {
    // step 1: get groups where it has members that has the same user id
    const groups = await this.prisma.group.findMany({
      where: {
        Members: {
          some: {
            UserID: userId,
          }
        }
      },
      include: {
        Members: true
      }
    })

    // step 2: map it into an array
    return groups.map((group) => {
      const memberIds = group.Members.map(member => member.UserID)
      return Group.from({
        GroupId: group.GroupID,
        Name: group.Name,
        Description: group.Description,
        CreatedBy: group.CreatedByUser,
        CreatedAt: group.CreatedAt,
      })
    })
  }

  // TODO: update group info (name & description)
  async update(group: Group, groupId: number, tx?: Prisma.TransactionClient): Promise<void> {

  }
  // TODO: remove group member
  // TODO: delete group
}