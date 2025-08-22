import { PrismaService } from '../common/prisma.service';
import { Injectable } from '@nestjs/common';
import { Debt } from '../entity/debt.entity';
import { DebtStatus, Prisma } from '@prisma/client';

@Injectable()
export class DebtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(debt: Debt, tx: Prisma.TransactionClient): Promise<Debt> {
    const prismaClient = tx ?? this.prisma;

    // 1. upsert method (create if debt doesn't exists, update if it exists)
    const upsertedDebt = await prismaClient.debt.upsert({
      where: {
        UserID_BillID: {
          UserID: debt.UserId,
          BillID: debt.BillId
        }
      },
      update: {
        AmountOwed: {
          increment: debt.AmountOwed,
        },
        Status: DebtStatus.unpaid,
      },
      create: {
        AmountOwed: debt.AmountOwed,
        Status: DebtStatus.unpaid,
        Bill: { connect: { BillID: debt.BillId } },
        User: { connect: { UserID: debt.UserId } },
      }
    })

    return Debt.from({
      DebtId: upsertedDebt.DebtID,
      BillId: upsertedDebt.BillID,
      UserId: upsertedDebt.UserID,
      AmountOwed: upsertedDebt.AmountOwed,
      Status: upsertedDebt.Status,
    });
  }

  async upsertMany(debts: Debt[], tx?: Prisma.TransactionClient): Promise<Debt[]> {
    const prismaClient = tx ?? this.prisma;

    const results = await Promise.all(
      debts.map((debt) =>
        prismaClient.debt.upsert({
          where: {
            UserID_BillID: {
              UserID: debt.UserId,
              BillID: debt.BillId,
            },
          },
          update: {
            AmountOwed: {
              increment: debt.AmountOwed,
            },
            Status: DebtStatus.unpaid,
          },
          create: {
            AmountOwed: debt.AmountOwed,
            Status: DebtStatus.unpaid,
            BillID: debt.BillId,
            UserID: debt.UserId,
          },
        }),
      ),
    );

    return results.map((d) =>
      Debt.from({
        DebtId: d.DebtID,
        BillId: d.BillID,
        UserId: d.UserID,
        AmountOwed: d.AmountOwed,
        Status: d.Status,
      }),
    );
  }
}