import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { DebtRepository } from "./debt.repository";
import { PrismaService } from "src/common/prisma.service";
import { BillsRepository } from "src/bills/bills.repository";
import { UserRepository } from "src/user/user.repository";
import { Debt } from "@prisma/client";
import { BillsArrayResponse } from "src/model/response/bills.response";
import { DebtArrayResponse, DebtResponse } from "src/model/response/debt.response";
import { Debt, Debt } from "src/entity/debt.entity";

@Injectable()
export class DebtService {
    constructor(@Inject(DebtRepository) private debtRepository: DebtRepository,
        private billRepository: BillsRepository,
        private userRepository: UserRepository,
        private readonly prisma: PrismaService,
    ) {}

    async settleDebt(billId: number, userId: number): Promise<void> {
        // 1. start a transaction
        const settleDebt = await this.prisma.$transaction(async (tx) => {
            // 2. Check if the bill exists
            const bill = await this.billRepository.getBillsByID(billId, tx);
            if (!bill) {
                throw new Error('Bill not found');
            }

            // 3. Check if the user exists
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // 4. Update the debt status to 'paid'
            const debt = await this.debtRepository.updateMany({
                where: {
                    BillID: billId,
                    UserID: userId,
                    Status: 'unpaid',
                },
                data: {
                    Status: 'paid',
                },
            });

            if (debt.count === 0) {
                throw new Error('No unpaid debt found for this user and bill');
            }
        }, { timeout: 20000 });
        return settleDebt;
    }

    async getDebt(userId: number): Promise<DebtArrayResponse[]>{
        // 1. Hit the repository 
        const debts = await this.debtRepository.getDebt(userId);
        
        // Conditional
        if (!debts || debts.length === 0) {
            throw new BadRequestException('No debts found for this user');
        }

        // 2. Convert to response
        return debts.map(debt => DebtArrayResponse.convertToResponse(debt));
    }
}
