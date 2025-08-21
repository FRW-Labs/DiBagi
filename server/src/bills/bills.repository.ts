import { PrismaService } from '../common/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bill } from '../entity/bill.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class BillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(bill: Bill, groupId: number, tx?: Prisma.TransactionClient): Promise<Bill> {
    const prismaClient = tx || this.prisma

    const dataToSave = {
      GroupID: groupId,
      Title: bill.Title,
      BillDate: bill.BillDate,
      TotalAmount: bill.TotalAmount,
      TaxAndService: bill.TaxAndService,
      Discount: bill.Discount,
      ReceiptImageURL: bill.ReceiptURL
    }

    const createdBill = await prismaClient.bill.create({
      data: dataToSave,
    })

    return Bill.from({
      GroupId: createdBill.GroupID,
      BillId: createdBill.BillID,
      Title: createdBill.Title,
      BillDate: createdBill.BillDate,
      TotalAmount: createdBill.TotalAmount,
      TaxAndService: createdBill.TaxAndService ?? 0,
      Discount: createdBill.Discount ?? 0,
      ReceiptURL: createdBill.ReceiptImageURL ?? '',
    })
  }

  async delete(billId: number, tx?: Prisma.TransactionClient): Promise<void> {
    const prismaClient = tx || this.prisma

    // 1. delete bills
    await prismaClient.bill.delete({
      where: { BillID: billId }
    })

    // 2. return
    return
  }

  // TODO: beresin ini update function
  // async update(billId: number, bill: Bill, tx?: Prisma.TransactionClient): Promise<Bill> {
  //
  // }

  async getBillsByID(billId: number, tx?: Prisma.TransactionClient): Promise<Bill | null> {
    const prismaClient = tx || this.prisma

    // 1. find bills
    const bill = await prismaClient.bill.findUnique({
      where: { BillID: billId },
      include: {
        Items: true,
        Debts: true,
      }
    })
    if (!bill) {
      return null
    }

    // 2. map item and debts
    const itemIds = bill.Items.map(item => item.ItemID)
    const debtsIds = bill.Debts.map(debt => debt.DebtID)

    // 3. return
    return Bill.from({
      GroupId: bill.GroupID,
      BillId: bill.BillID,
      Title: bill.Title,
      BillDate: bill.BillDate,
      TotalAmount: bill.TotalAmount,
      TaxAndService: bill.TaxAndService ?? 0,
      Discount: bill.Discount ?? 0,
      ReceiptURL: bill.ReceiptImageURL ?? '',
      itemIds: itemIds,
      debtIds: debtsIds,
    })
  }
  
  async getBills(groupId: number, tx?: Prisma.TransactionClient): Promise<Bill[]> {
    const prismaClient = tx || this.prisma

    const bills = await prismaClient.bill.findMany({
      where: { GroupID: groupId },
      include: {
        Items: true,
        Debts: true,
      }
    })

    return bills.map(bill => Bill.from({
      GroupId: bill.GroupID,
      BillId: bill.BillID,
      Title: bill.Title,
      BillDate: bill.BillDate,
      TotalAmount: bill.TotalAmount,
      TaxAndService: bill.TaxAndService ?? 0,
      Discount: bill.Discount ?? 0,
      ReceiptURL: bill.ReceiptImageURL ?? '',
      itemIds: bill.Items.map(item => item.ItemID),
      debtIds: bill.Debts.map(debt => debt.DebtID)
    }))
  }
}