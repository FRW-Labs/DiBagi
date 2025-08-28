import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Item } from '../entity/item.entity';
import { Prisma } from '@prisma/client';
import { connect } from 'http2';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(item: Item, billId: number, quantity: number, tx?: Prisma.TransactionClient): Promise<Item> {
    const prismaClient = tx ?? this.prisma

    const dataToSave = {
      Name: item.Name,
      Price: item.Price,
      Bill: {
        connect: {
          BillID: billId,
        }
      },
      Participants: {
          create: {
            User: {
              connect: {
                UserID: item.UserId,
              },
            },
            // Tambahkan data lain jika ada di tabel ItemParticipants
            Quantity: 1, // Atau nilai default lainnya
          },
        },
    }

    const createdItem = await prismaClient.item.create({
      data: dataToSave,
      include: {
        Participants : true
      }
    })

    return Item.from({
      ItemId: createdItem.ItemID,
      BillId: createdItem.BillID,
      Name: createdItem.Name,
      Price: createdItem.Price,
      UserId: createdItem.UserID,
    })
  }

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
}