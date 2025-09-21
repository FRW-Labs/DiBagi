import { ApiProperty } from '@nestjs/swagger';
import { Bill } from '../../entity/bill.entity';
import { IsArray, IsDate, IsNumber, IsObject, IsString } from 'class-validator';
import { ItemResponse } from './item.response';
import { Item } from '../../entity/item.entity';

export class BillsResponse {
  @ApiProperty({
    description: 'Group ID',
    format: 'number',
    example: '1'
  })
  GroupId: number;

  @ApiProperty({
    description: 'Bill ID',
    format: 'number',
    example: '1'
  })
  BillId: number;

  @ApiProperty({
    description: 'Bill Title',
    format: 'string',
    example: 'Pepper Lunch'
  })
  Title: string;

  @ApiProperty({
    description: 'Bill Dates',
    format: 'date',
    example: '2021-01-01'
  })
  BillDate: Date;

  @ApiProperty({
    description: 'Total Amount',
    format: 'number',
    example: '1000'
  })
  TotalAmount: number;

  @ApiProperty({
    description: 'Tax and Service',
    format: 'number',
    example: '1000'
  })
  TaxAndService: number;

  @ApiProperty({
    description: 'Discount',
    format: 'number',
    example: '10000'
  })
  Discount: number;

  @ApiProperty({
    description: 'Receipts Image URL',
    format: 'string',
    example: 'https://upload.wijaya.com/uploads/2021-03-01.png'
  })
  ReceiptImageUrl: string;

  @ApiProperty({
    description: 'Items',
    format: 'array',
  })
  @IsArray()
  @IsObject()
  Items: ItemResponse[]

  static convertToResponse(bill: Bill, items: Item[]): BillsResponse {
    const dto = new BillsResponse()
    dto.BillId = bill.BillId
    dto.GroupId = bill.GroupId
    dto.Title = bill.Title
    dto.BillDate = bill.BillDate
    dto.TotalAmount = bill.TotalAmount
    dto.TaxAndService = bill.TaxAndService
    dto.Discount = bill.Discount
    dto.ReceiptImageUrl = bill.ReceiptURL
    dto.Items = items.map(item => ItemResponse.convertToResponse(item))
    // data transfer object || Encapsulation, REQUEST RESPONSE.
    return dto
  }
}

export class BillsArrayResponse {
  // Bill Id
  @ApiProperty({
    description: 'BillID By GroupID',
    format: 'number',
    example: '1'
  })
  @IsNumber()
  BillId: number
  
  // Title
  @ApiProperty({
    description: 'Bill Title',
    format: 'string',
    example: 'Paradise Kitchen'
  })
  @IsString()
  Title: string

  // Bill Date
  @ApiProperty({
    description: 'Date',
    format: 'date',
    example: '2021-01-01'
  })
  @IsDate()
  BillDate: Date;

  // TotalAmount
  @ApiProperty({
    description: 'Total Amount',
    format: 'number',
    example: '1000'
  })
  @IsNumber()
  TotalAmount: number;

  static convertToResponse(bill: Bill): BillsArrayResponse {
    const dto = new BillsArrayResponse()
    dto.BillId = bill.BillId
    dto.Title = bill.Title
    dto.BillDate = bill.BillDate
    dto.TotalAmount = bill.TotalAmount
    // data transfer object || Encapsulation, REQUEST RESPONSE.
    return dto
  }
}