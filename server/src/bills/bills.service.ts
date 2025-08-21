import { Inject, Injectable } from '@nestjs/common';
import { BillsRepository } from './bills.repository';
import { BillsRequest } from '../model/request/bills.request';
import { BillsResponse } from '../model/response/bills.response';
import { Bill } from '../entity/bill.entity';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class BillsService {
  constructor (@Inject(BillsRepository) private billsRepository: BillsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(req: BillsRequest, groupId: number): Promise<BillsResponse> {
    // change request into entity
    const billEntity = Bill.new({
      Title: req.Title,
      TaxAndService: req.TaxAndService,
      Discount: req.Discount,
      ReceiptURL: req.ReceiptsImageUrl
    })

    // start transaction
    const resultEntity = await this.prisma.$transaction(async (tx) => {
      return await this.billsRepository.create(billEntity, groupId, tx);
    });

    // convert result entity to response
    return BillsResponse.convertToResponse(resultEntity);
  }
}