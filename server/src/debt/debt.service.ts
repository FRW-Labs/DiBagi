import { Inject, Injectable } from "@nestjs/common";
import { DebtRepository } from "./debt.repository";
import { PrismaService } from "src/common/prisma.service";
import { BillsRepository } from "src/bills/bills.repository";
import { UserRepository } from "src/user/user.repository";

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
            const user = await this.userRepository.findById(userId, tx);
            if (!user) {
                throw new Error('User not found');
            }

            // 4. Update the debt status to 'paid'
            const debt = await this.debtRepository.prisma.debt.updateMany({
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

    async getDebts(userId: number): Promise<any[]>{
        // 1. start a transaction
        const debts = await this.prisma.$transaction (
        async (tx) => {
            // 2. Check if the user exists
            const user = await this.userRepository.findById(userId, tx);
            if (!user) {
                throw new Error('User not found');
            }

            // 3. Get the user's debts
            const debts = await this.debtRepository.getDebt(userId, tx);
            return debts;
        });
        return debts;
    }
}
