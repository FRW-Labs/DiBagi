import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { ItemRequest } from './item.request';

export class BillsRequest {
  @ApiProperty({
    description: "Title of the Bills",
    format: "text",
    minimum: 6,
    maximum: 100,
    example: "Pepper Lunch",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  Title: string;

  @ApiProperty({
    description: "Group ID",
    format: "number",
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  GroupId: number;

  @ApiProperty({
    description: "List of Item that inside the bills",
    format: "array",
    required: true,
  })
  @IsArray()
  @IsObject()
  @IsNotEmpty()
  Items: ItemRequest[];

  @ApiProperty({
    description: "Tax and Service",
    format: "number",
    example: 10000, // Misal tax & service-nya itu persen berarti bakal di kali dulu buat dapet hasilnya
    required: false,
  })
  @IsNumber()
  @IsOptional()
  TaxAndService?: number;

  @ApiProperty({
    description: "Discount",
    format: "number",
    example: 10000, // Misal discount-nya itu persen berarti bakal di kali dulu buat dapet hasilnya
    required: false,
  })
  @IsNumber()
  @IsOptional()
  Discount?: number;

  @ApiProperty({
    description: "Image Url (Cloudinary Links)",
    format: "number",
    example: "https://www.cloudinary.com/v1/image/upload", // buat lanjut ke tahap 2
    required: false,
  })
  @IsString()
  @IsOptional()
  ReceiptsImageUrl?: string;
}