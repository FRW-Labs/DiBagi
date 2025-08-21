import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DebtRequest {
  @ApiProperty({
    description: 'Corresponding Bill ID',
    type: 'number',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  BillId: number;

  @ApiProperty({
    description: 'Corresponding User ID',
    type: 'number',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  UserId: number;

  @ApiProperty({
    description: 'Amount of the item',
    type: 'number',
    example: 10000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  AmountOwed: number;
}