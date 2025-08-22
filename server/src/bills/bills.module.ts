import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { BillsRepository } from './bills.repository';
import { DebtRepository } from '../debt/debt.repository';
import { ItemRepository } from '../item/item.repository';

@Module({
  controllers: [
    BillsController,
  ],
  providers: [
    BillsService,
    BillsRepository,
    PrismaService,
    DebtRepository,
    ItemRepository
  ],
  exports: [
    BillsRepository,
  ],
})
export class BillsModule {}