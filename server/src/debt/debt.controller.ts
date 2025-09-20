import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Debt } from "@prisma/client";
import { WebResponse } from "src/model/web.model";
import { JwtAuthGuard } from "src/common/jwt.service";
import { DebtService } from "./debt.service";
import { Auth } from "src/common/user.decorator";
import { User } from "src/entity/user.entity";
import { Body } from "@nestjs/common/decorators";
import { DebtRequest } from "src/model/request/debt.request";

@ApiTags('Debt')
@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('settle')
  @UseGuards(JwtAuthGuard) // perlu login
  @ApiOperation({ summary: 'Settle (mark as paid) a users debt for a specific bill' })
  @ApiResponse({ status: 200, description: 'Debt settled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Bill/User/Unpaid debt not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async settle(
    @Body() debtRequest: DebtRequest,
    @Auth() user: User,
  ): Promise<WebResponse<null>> {
    // debtRequest harus minimal punya billId
    await this.debtService.settleDebt(debtRequest.BillId, user.UserId);

    return {
      data: null,
    };
  }
}