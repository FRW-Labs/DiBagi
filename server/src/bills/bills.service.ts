import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BillsRepository } from './bills.repository';
import { BillsRequest } from '../model/request/bills.request';
import { BillsArrayResponse, BillsResponse } from '../model/response/bills.response';
import { Bill } from '../entity/bill.entity';
import { PrismaService } from '../common/prisma.service';
import { ItemRepository } from '../item/item.repository';
import { DebtRepository } from '../debt/debt.repository';
import { User } from '../entity/user.entity';
import { CalculateTotalAmount } from '../common/calculator.service';
import { Item } from '../entity/item.entity';
import { Debt } from '../entity/debt.entity';
import { DebtStatus } from '@prisma/client';

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

      // 4. map item into entity and call repository layer (bulk insert)
      const itemsData = req.items.map(item => Item.new({
        BillId: billFromDB.BillId,
        UserId: item.userid,
        Name: item.name,
        Price: item.price,
      }))
      const itemsFromDB =await this.itemRepository.createMany(itemsData, billFromDB.BillId, tx)

      // 5. map debt into entity and call repository layer (bulk insert)
      const debtsData = req.items.map(item => Debt.new({
        BillId: billFromDB.BillId,
        UserId: item.userid,
        AmountOwed: item.price,
        Status: DebtStatus.unpaid,
      }))

      await this.debtRepository.upsertMany(debtsData, tx)

      // 6. return results
      return BillsResponse.convertToResponse(billFromDB, itemsFromDB)
    }, { timeout: 20000 })
    return finalBillEntity;
  }

  async getBillById(billId: number) : Promise<BillsResponse>{
    // 1. Hit Repository
    const bill=await this.billsRepository.getBillsByID(billId)
    // 1.1 Hit Item Repository
    if (!bill){
      throw new NotFoundException()
    }

    const itemIds = bill.getItems();
    const items: Item[] = []; // Initialize the array
    for (const itemId of itemIds) {
      const item = await this.itemRepository.getItemsbyId(itemId);
      if (!item) {
        throw new NotFoundException(`Item with ID ${itemId} not found.`); // Use itemId
      }
      items.push(item);
    }

    // 2. Convert to Response
    return BillsResponse.convertToResponse(bill, items)
  }

  async getBills(groupId: number): Promise<BillsArrayResponse[]> {
    // 1. Hit Repository
    const bills = await this.billsRepository.getBills(groupId)

    // CONDITIONAL
    if (!bills || bills.length === 0){
      throw new NotFoundException(`No bills found for group ID ${groupId}`);
    }
    
    // 2. Convert to Response
    return bills.map(bill => BillsArrayResponse.convertToResponse(bill))
  }

  async update(billId: number, req: BillsRequest, user: User): Promise<BillsResponse> {
    // 1. start a transaction
    const updatedBill = await this.prisma.$transaction(async (tx) =>{

      // 2. authorization layer
      const billToUpdate = await this.billsRepository.getBillsByID(billId);
      if (!billToUpdate) {
        throw new NotFoundException(`Bill dengan ID ${billId} tidak ditemukan.`);
      }
      if (billToUpdate.GroupId !== req.groupid) {
        throw new NotFoundException(`Bill dengan ID ${billId} tidak ditemukan di group ${req.groupid}.`);
      }

      // 3. map bill into an entity
     const billEntity = Bill.from({
        GroupId: req.groupid,
        BillId: billId,
        Title: req.title,
        TaxAndService: req.taxandservice,
        Discount: req.discount,
        TotalAmount: CalculateTotalAmount(
          req.items, 
          req.taxandservice, 
          req.discount
        ),
        // ReceiptURL: req.receiptsimageurl,
        BillDate : billToUpdate.BillDate,
    })
    // 4. call bills repository
    return await this.billsRepository.update(billEntity, tx)
  })
  // 5. convert to response
  return BillsResponse.convertToResponse(updatedBill, [])
  }
  
  async deleteBill(billId: number, user: User): Promise<string> {
    // 1. start a transaction
    const updatedBill = await this.prisma.$transaction(async (tx) => {
      // 2. authorization layer
      const targetBill = await this.billsRepository.getBillsByID(billId);
      if (!targetBill) {
        throw new NotFoundException(`Bill dengan ID ${billId} tidak ditemukan.`);
      }

      if (targetBill.GroupId !== targetBill.BillId) {
        throw new NotFoundException(`Bill dengan ID ${billId} tidak ditemukan di group ${targetBill.GroupId}.`);
      }

      return await this.billsRepository.deleteBill(billId, tx)
    })
    return `Deleted bill with id ${billId}`
  }
}