import { Inject, Injectable } from '@nestjs/common';
import { BillsRepository } from './bills.repository';
import { BillsRequest } from '../model/request/bills.request';
import { BillsResponse } from '../model/response/bills.response';
import { Bill } from '../entity/bill.entity';
import { PrismaService } from '../common/prisma.service';
import { ItemRepository } from '../items/item.repository';
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
    // 1. map bill into an entity
    const billEntity = Bill.new({
      Title: req.Title,
      TaxAndService: req.TaxAndService,
      Discount: req.Discount,
      TotalAmount: CalculateTotalAmount(req.Items, req.TaxAndService, req.Discount),
      ReceiptURL: req.ReceiptsImageUrl,
    })

    // 2. call bills repository
    const billFromDB = await this.prisma.$transaction(async (tx) => {
      return await this.billsRepository.create(billEntity, req.GroupId, tx)
    })

    // 3. map item into entity and call repository layer
    for (const item of req.Items) {
      const itemEntity = Item.new({
        BillId: item.BillId,
        userIds: item.UserId, // TODO: pikirin ini item better one-to-one atau one-to-many
        Name: item.Name,
        Price: item.Price,
      })

      const itemsFromDB = await this.prisma.$transaction(async (tx) => {
        return await this.itemRepository.create(itemEntity, billFromDB.BillId, item.UserId[0], tx) // TODO: keliatannya bakal dijadiin one-to-one relationship tapi sementara kek begini dulu
      })

      // 4. create/update debts table for each corresponding user
      const debtEntity = Debt.new({
        BillId: billFromDB.BillId,
        UserId: itemsFromDB.getUsers(),
      })
    }

    // 5. return results
    return BillsResponse.convertToResponse(billFromDB) // TODO: bagian response juga buat array of items buat kasih liat
  }
}