import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupRequest {
  @ApiPropertyOptional({
    description: 'Group Name',
    format: 'text',
    required: true,
    example: 'Jalan-jalan ke Bali'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Description',
    format: 'text',
    example: 'Jalan-jalan ke Bali hari Minggu, makan di restoran A'
  })
  @IsString()
  @IsOptional()
  description?: string;

  // Group Created By @username will be taken from Context (so user just need to pass the JWT Token)
}

export class InviteUserDto {
  @ApiPropertyOptional({
    description: 'Invite a new member to a group',
    format: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}