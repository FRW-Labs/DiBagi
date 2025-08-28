import { PrismaService } from '../common/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bill } from '../entity/bill.entity';
import { DebtStatus, Prisma } from '@prisma/client';

@Injectable()
export class BillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(bill: Bill, groupId: number, tx?: Prisma.TransactionClient): Promise<Bill> {
    const prismaClient = tx ?? this.prisma

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
    const prismaClient = tx ?? this.prisma
  }

  // 
  async getBillsByID(billId: number, tx?: Prisma.TransactionClient): Promise<Bill | null> {
    const prismaClient = tx ?? this.prisma
    const bills = await prismaClient.bill.findUnique({
      where: {BillID : billId}, include: {
        Items: true,
        Debts: true,
        // ketika butuh include dari tabel lain
      }
    })
    if (!bills) {
      return null
    }
    return Bill.from({
      GroupId : bills.GroupID,
      BillId : bills.BillID,
      Title : bills.Title,
      BillDate : bills.BillDate,
      TotalAmount : bills.TotalAmount,
      TaxAndService : bills.TaxAndService ?? 0, // number null
      Discount : bills.Discount ?? 0, // number null
      ReceiptURL : bills.ReceiptImageURL ?? '', // string null
      itemIds : bills.Items.map(item => item.ItemID), // map untuk array, ngambil ID Item dalam Array
      debtIds : bills.Debts.map(debt => debt.DebtID),
    })
  }
  
  async getBills(groupId: number, tx?: Prisma.TransactionClient): Promise<Bill[]> {
    const prismaClient = tx ?? this.prisma

    const bills = await prismaClient.bill.findMany({
      where: { GroupID: groupId },
      // include: {
      //   Items: true
      //   Debts: true,
      // }
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
      // itemIds: bill.Items.map(item => item.ItemID),
      // debtIds: bill.Debts.map(debt => debt.DebtID)
    }))
  }
}