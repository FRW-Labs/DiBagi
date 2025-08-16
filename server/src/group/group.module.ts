import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';

@Module({
  controllers: [
    GroupController,
  ],
  providers: [
    GroupService,
    GroupRepository,
    PrismaService,
  ],
  exports: [
    GroupRepository,
  ],
})
export class GroupModule {}