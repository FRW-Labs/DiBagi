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

  async getItem(billId: number): Promise<Item[]>{
    // setp 1: get items where it has bill id that is the same as billId
    const bills = await this.prisma.item.findMany({
      where: {
        Bill : {
          BillID: billId // filter bills by billId
        }
      },
      include: {
        Bill: true
      }
    })

    // step 2: map it into an array
    return bills.map((item) => {
      const billIds = bills.map(bill => bill.BillID) // ???
      return Item.from({
        ItemId: item.ItemID,
        BillId: item.Bill.BillID,
        Name: item.Name,
        Price: item.Price,
        UserId: item.UserID,
      })
    })
  }

  async update(item: Item, tx?: Prisma.TransactionClient): Promise<Item> {
    const prismaClient = tx ?? this.prisma;
    // 1. define the changed data
    const dataToChange = {
      Name: item.Name,
      Price: item.Price,
    }

    // 2. update the item
    const editedItem = await prismaClient.item.update({
      where: { ItemID: item.ItemId },
      data: dataToChange,
      include: {
        Bill: true
      }
    })

    const billId = editedItem.Bill.BillID

    return Item.from({
      ItemId: editedItem.ItemID,
      BillId: billId,
      Name: editedItem.Name,
      Price: editedItem.Price,
      UserId: editedItem.UserID,
    })
  }
}