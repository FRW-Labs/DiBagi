import { Group } from '../../entity/group.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GroupResponse {
  @ApiProperty({
    description: 'Group ID',
    format: 'number',
    example: '1'
  })
  GroupId: number;

  @ApiProperty({
    description: 'Group Name',
    format: 'text',
    example: 'jalan-jalan ke Bali'
  })
  Name: string;

  @ApiProperty({
    description: 'Group Description',
    format: 'text',
    example: 'jalan-jalan ke Bali hari Minggu'
  })
  Description?: string;

  @ApiProperty({
    description: 'Group Created by @Username',
    format: 'text',
    example: '@ser3nity'
  })
  CreatedBy: string;

  @ApiProperty({
    description: 'Group Created by Date',
    format: 'date',
    example: '2017-07-10T00:00:00.000Z',
  })
  CreatedAt: Date;

  @ApiProperty({
    description: 'Group members',
    format: 'array',
    example: [1, 2, 4]
  })
  MemberIds: number[];

  static convertToResponse(group: Group): GroupResponse {
    const dto = new GroupResponse();
    dto.GroupId = group.GroupId
    dto.Name = group.Name
    dto.Description = group.Description
    dto.CreatedBy = group.CreatedBy
    dto.CreatedAt = group.CreatedAt
    dto.MemberIds = group.getMembers()
    return dto
  }
}