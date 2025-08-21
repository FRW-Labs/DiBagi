import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Item } from '../entity/item.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(item: Item, billId: number, userId: number, tx?: Prisma.TransactionClient): Promise<Item> {
    const prismaClient = tx || this.prisma

    const dataToSave = {
      Name: item.Name,
      Price: item.Price,
      Bill: {
        connect: {
          BillID: billId,
        }
      },
      Participants: {
        create: [
          {
            User: {
              connect: { UserID: userId }
            }
          }
        ]
      }
    }

    const createdItem = await prismaClient.item.create({
      data: dataToSave,
      include: {
        Participants: true,
      }
    })

    return Item.from({
      ItemId: createdItem.ItemID,
      BillId: createdItem.BillID,
      Name: createdItem.Name,
      Price: createdItem.Price,
      userIds: createdItem.Participants.map((p) => p.UserID),
    })
  }
}