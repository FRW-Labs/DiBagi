import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ItemRequest {
  @ApiProperty({
    description: 'Users who buy this item',
    type: 'number',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  userid: number;

  @ApiProperty({
    description: 'Name of the item',
    type: 'string',
    example: 'Chicken Cordon Bleu',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Price of the item (in Rp)',
    type: 'number',
    example: 10000, // Rp. 10,000
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}