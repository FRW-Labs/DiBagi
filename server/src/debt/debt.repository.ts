import { PrismaService } from '../common/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { Debt } from '../entity/debt.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class DebtRepository {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async create(billId: number, userId: number, debt: Debt, tx: Prisma.TransactionClient): Promise<Debt> {
    const prismaClient = tx || this.prisma;

    const dataToSave = {
      BillID: billId,
      UserID: userId,
      AmountOwed: debt.AmountOwed,
      Status: debt.Status,
    }

    const DebtEntity = await prismaClient.debt.create({
      data: dataToSave
    })

    return Debt.from({
      DebtId: DebtEntity.DebtID,
      BillId: DebtEntity.BillID,
      UserId: DebtEntity.UserID,
      AmountOwed: DebtEntity.AmountOwed,
      Status: DebtEntity.Status,
    })
  }
}