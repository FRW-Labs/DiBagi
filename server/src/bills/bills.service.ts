import { Inject, Injectable } from '@nestjs/common';
import { BillsRepository } from './bills.repository';
import { BillsRequest } from '../model/request/bills.request';
import { BillsResponse } from '../model/response/bills.response';
import { Bill } from '../entity/bill.entity';
import { PrismaService } from '../common/prisma.service';
import { ItemRepository } from '../item/item.repository';
import { DebtRepository } from '../debt/debt.repository';
import { User } from '../entity/user.entity';
import { CalculateTotalAmount } from '../common/calculator.service';
import { Item } from '../entity/item.entity';
import { Debt } from '../entity/debt.entity';

@Injectable()
export class BillsService {
  constructor (@Inject(BillsRepository) private billsRepository: BillsRepository,
    private itemRepository: ItemRepository,
    private debtRepository: DebtRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(req: BillsRequest, user: User): Promise<BillsResponse> {
    // 1. start a transaction
    const finalBillEntity = await this.prisma.$transaction(async (tx) => {
      // 2. map bill into an entity
      const billEntity = Bill.new({
        Title: req.title,
        TaxAndService: req.taxandservice,
        Discount: req.discount,
        TotalAmount: CalculateTotalAmount(req.items, req.taxandservice, req.discount),
        ReceiptURL: req.receiptsimageurl,
      })

      // 3. call bills repository
      const billFromDB = await this.billsRepository.create(billEntity, req.groupid, tx)

      // 4. map item into entity and call repository layer
      let itemsFromDB: Item[] = [];
      for (const item of req.items) {
        const itemEntity = Item.new({
          BillId: billFromDB.BillId,
          UserId: item.userid,
          Name: item.name,
          Price: item.price,
        })

        const itemsRepository = await this.itemRepository.create(itemEntity, billFromDB.BillId, tx)
        itemsFromDB.push(itemsRepository)

        // 5. create/update debts table for each corresponding user
        const debtEntity = Debt.new({
          BillId: billFromDB.BillId,
          UserId: item.userid,
          AmountOwed: item.price,
          Status: DebtStatus.unpaid
        })

        await this.debtRepository.create(debtEntity, tx)
      }

      // 6. return results
      return BillsResponse.convertToResponse(billFromDB, itemsFromDB)
    })
    return finalBillEntity;
  }
}