import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Item } from '../entity/item.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(item: Item, billId: number, tx?: Prisma.TransactionClient): Promise<Item> {
    const prismaClient = tx ?? this.prisma

    const dataToSave = {
      Name: item.Name,
      Price: item.Price,
      Bill: {
        connect: {
          BillID: billId,
        }
      },
      Payer: {
        connect: {
          UserID: item.UserId,
        }
      }
    }

    const createdItem = await prismaClient.item.create({
      data: dataToSave,
    })

    return Item.from({
      ItemId: createdItem.ItemID,
      BillId: createdItem.BillID,
      Name: createdItem.Name,
      Price: createdItem.Price,
      UserId: createdItem.UserID,
    })
  }
}