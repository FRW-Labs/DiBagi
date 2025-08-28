import { Item } from '../../entity/item.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ItemResponse {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'uuid'
  })
  ItemID: string;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 1
  })
  BillID: number;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 1
  })
  UserID: number;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'White Chocolate Mocha'
  })
  Name: string;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 10000
  })
  Price: number;

  static convertToResponse(item: Item): ItemResponse {
    const dto = new ItemResponse();
    dto.ItemID = item.ItemId
    dto.BillID = item.BillId
    dto.UserID = item.UserId
    dto.Name = item.Name
    dto.Price = item.Price
    return dto
  }
}