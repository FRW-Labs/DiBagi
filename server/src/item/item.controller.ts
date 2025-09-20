import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ItemService } from "./item.service";
import { get } from "http";
import { JwtAuthGuard } from "src/common/jwt.service";
import { Auth } from "src/common/user.decorator";
import { Bill } from "src/entity/bill.entity";

@ApiTags('Item')
@Controller('item')
export class ItemController {
    // Item related endpoints can be added here in the future
    constructor(private readonly itemService: ItemService) {}

   @Get('gets:by-bill') 
   @UseGuards(JwtAuthGuard)
   @ApiOperation({ summary: 'Get items by bill ID' })
   @ApiResponse({ status: 400, description: 'Bill does not have any item' })
   @ApiResponse({ status: 200, description: 'Items found' })
   async getItemsByBillId(@Auth() bill: Bill) {
    const items = await this.itemService.getItem(bill)

    return {
        data : items,
    }
   }
}