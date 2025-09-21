import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { Item } from 'src/entity/item.entity';
import { ItemResponse } from 'src/model/response/item.response';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class ItemService { 
  constructor(
    @Inject(ItemRepository) private readonly itemsRepository: ItemRepository, 
    private readonly prisma: PrismaService,
    ) {}

  async getItem(billId: number): Promise<ItemResponse[]> { // BY ID BILL (jadi cari item didalam 1 bill)
    // 1. Ambil semua item yang terkait dengan BillID
    const items: Item[] = await this.itemsRepository.getItem(billId);

    // 2. Jika tidak ada item, bisa lempar error atau return array kosong
    if (!items || items.length === 0) {
      throw new NotFoundException(`Tidak ada item untuk Bill dengan ID ${billId}`);
    }

    // 3. Konversi entity -> DTO Response
    return items.map(item => ItemResponse.convertToResponse(item));
  }

  async deleteItem(itemID: string): Promise<void> {
    const updatedItem = await this.prisma.$transaction(async (tx)=> {
      const targetItem = await this.itemsRepository.getItemsbyId(itemID);
      if (!targetItem){
        throw new NotFoundException(`Item dengan ID ${itemID} tidak ditemukan.`);
      }
      
      return await this.itemsRepository.deleteItem(itemID, tx)
    })
  }
}
