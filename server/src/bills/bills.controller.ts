import { BillsService } from './bills.service';
import { BillsResponse } from '../model/response/bills.response';
import { WebResponse } from '../model/web.model';
import { BillsRequest } from '../model/request/bills.request';
import { User } from '../entity/user.entity';
import { Auth } from '../common/user.decorator';
import { Body } from '@nestjs/common';

export class BillsController {
  constructor(private readonly billService: BillsService) {}

  async create(@Body() billRequest: BillsRequest, @Auth() user: User): Promise<WebResponse<BillsResponse>> {
    const bill = await this.billService.create(billRequest, user)
    return {
      data: bill,
    }
  }
}