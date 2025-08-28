import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Item } from '../entity/item.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(items: Item[], billId: number, tx?: Prisma.TransactionClient): Promise<Item[]> {
    const prismaClient = tx ?? this.prisma

    const dataToSave = items.map((item) => ({
      Name: item.Name,
      Price: item.Price,
      BillID: billId,
      UserID: item.UserId,
    }))

    await prismaClient.item.createMany({
      data: dataToSave
    })

    const itemsFromDB = await prismaClient.item.findMany({
      where: { BillID: billId },
    });

    return itemsFromDB.map((i) =>
      Item.from({
        ItemId: i.ItemID,
        BillId: i.BillID,
        Name: i.Name,
        Price: i.Price,
        UserId: i.UserID,
      }),
    );
  }

  async getItemsbyId(itemId: string, tx?:Prisma.TransactionClient): Promise<Item | null>{
    const prismaClient = tx ?? this.prisma
    const getItems = await prismaClient.item.findUnique({
      where:{
        ItemID: itemId,
      }
    })

    if (!getItems){
      return null
    }

    return Item.from({
      ItemId: getItems.ItemID,
      BillId: getItems.BillID,
      Name: getItems.Name,
      Price: getItems.Price,
      UserId: getItems.UserID,
    })
  }
}