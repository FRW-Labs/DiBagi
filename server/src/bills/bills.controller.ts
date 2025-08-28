import { BillsService } from './bills.service';
import { BillsResponse } from '../model/response/bills.response';
import { WebResponse } from '../model/web.model';
import { BillsRequest } from '../model/request/bills.request';
import { User } from '../entity/user.entity';
import { Auth } from '../common/user.decorator';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../common/jwt.service";

@ApiTags('Bills')
@Controller('bill')
export class BillsController {
  constructor(private readonly billService: BillsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new bill' })
  @ApiResponse({ status: 201, description: 'Create new bill', type: WebResponse<BillsResponse> })
  @ApiResponse({ status: 500, description: 'An error occured' })
  async create(@Body() billRequest: BillsRequest, @Auth() user: User): Promise<WebResponse<BillsResponse>> {
    const bill = await this.billService.create(billRequest, user)
    return {
      data: bill,
    }
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get bill by ID' })
  @ApiResponse({ status: 200, description: 'Get bill by ID', type: WebResponse<BillsResponse> })
  async getBillById(@Param('id') id: number): Promise<WebResponse<BillsResponse>> {
    const bill = await this.billService.getBillById(id)
    return {
      data: bill,
    }
  }
}
