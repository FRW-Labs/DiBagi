import { Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
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
    const items = await this.itemService.getItem(bill) //?

    return {
        data : items,
    }
   }

   @Delete(':itemID/delete')
   @UseGuards(JwtAuthGuard)
   @ApiOperation({ summary: 'Delete item by ID' })
   @ApiResponse({ status: 404, description: 'Item not found' })
   @ApiResponse({ status: 200, description: 'Item deleted successfully' })
   async deleteItem(@Param('itemID') itemID: string) {
    await this.itemService.deleteItem(itemID);
    return {
        message: 'Item deleted successfully',
    };
   }

    @Put(':itemID/update')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update item by ID' })
    @ApiResponse({ status: 404, description: 'Item not found' })
    @ApiResponse({ status: 200, description: 'Item updated successfully' })
    async updateItem(
        @Param('itemID') itemID: string,
        @Param('name') name: string,
        @Param('price') price: number,
    ) {
        const updatedItem = await this.itemService.updateItem(itemID, name, price);
        return {
            data: updatedItem,
            message: 'Item updated successfully',
        };
    }
}