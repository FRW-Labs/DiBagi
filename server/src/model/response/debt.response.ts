import { ApiProperty } from "@nestjs/swagger";
import { Debt } from "../../entity/debt.entity";
import { IsNumber, IsArray, IsString} from "class-validator";
import { DebtStatus } from "@prisma/client";
import { BillsResponse } from "./bills.response";


export class DebtResponse {
    @ApiProperty({
        description : 'Array of Debt',
        format: 'number',
        example: '1'
    })
    DebtId: number;

    @ApiProperty({
        description : 'Bill ID',
        format: 'number',
        example: '1'
    })
    BillId: number;

    @ApiProperty({
        description : 'User ID',
        format: 'number',
        example: '1'
    })
    UserId: number;

    @ApiProperty({
        description : 'Amount Owed',
        format: 'number',
        example: '50000'
    })
    AmountOwed: number;

    @ApiProperty({
        description : 'Debt Status',
        format: 'text',
        example: 'unpaid'
    })
    Status: string;

    static convertToResponse(debt: Debt): DebtResponse {
        const dto = new DebtResponse();
        dto.DebtId = debt.DebtId;   
        dto.BillId = debt.BillId;
        dto.UserId = debt.UserId;
        dto.AmountOwed = debt.AmountOwed;
        dto.Status = debt.Status;
        return dto;
    }
}

export class DebtArrayResponse {
    @ApiProperty({
        description : 'Array of Debt',
        format: 'number',
        example: '1'
    })
    @IsNumber()
    DebtId: number;

    @ApiProperty({
        description : 'Bill ID',
        format: 'number',
        example: '1'
    })
    @IsNumber()
    BillId: number;

    @ApiProperty({
        description : 'User ID',
        format: 'number',
        example: '1'
    })
    @IsNumber()
    UserId: number;

    @ApiProperty({
        description : 'Amount Owed',
        format: 'number',
        example: '50000'
    })
    @IsNumber()
    AmountOwed: number;

    @ApiProperty({
        description : 'Debt Status',
        format: 'text',
        example: 'unpaid'
    })
    @IsString()
    Status: string;

    static convertToResponse(debt: Debt): DebtArrayResponse {
        const dto = new DebtArrayResponse()
        dto.DebtId = debt.DebtId
        dto.BillId = debt.BillId
        dto.UserId = debt.UserId
        dto.AmountOwed = debt.AmountOwed
        dto.Status = debt.Status
        return dto
    }
}
