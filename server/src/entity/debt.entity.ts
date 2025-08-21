import { DebtStatus } from '@prisma/client';

export class Debt {
  public readonly DebtId: number;
  public readonly BillId: number;
  public readonly UserId: number;
  public readonly AmountOwed: number;
  public Status: DebtStatus;

  private constructor(props: {
    DebtId: number;
    BillId: number;
    UserId: number;
    AmountOwed: number;
    Status: DebtStatus;
  }) {
    this.DebtId = props.DebtId;
    this.BillId = props.BillId;
    this.UserId = props.UserId;
    this.AmountOwed = props.AmountOwed;
    this.Status = props.Status;
  }

  public static new(props: {
    BillId: number;
    UserId: number;
    AmountOwed: number;
    Status: DebtStatus;
  }): Debt {
    return new Debt({
      ...props,
      DebtId: 0,
    })
  }

  public static from(props: {
    DebtId: number;
    BillId: number;
    UserId: number;
    AmountOwed: number;
    Status: DebtStatus;
  }) : Debt {
    return new Debt(props)
  }

  public markAsPaid() {
    if (this.Status === DebtStatus.unpaid) {
      this.Status = DebtStatus.paid;
      // TODO: Message Broker Event (Publish an event here using Kafka)
    }
  }
}
