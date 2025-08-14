export class Debt {
  public readonly DebtId: number;
  public readonly BillId: number;
  public readonly UserId: number;
  public readonly AmountOwed: number;
  public Status: debtStatus;

  private constructor(props: {
    DebtId: number;
    BillId: number;
    UserId: number;
    AmountOwed: number;
    Status: debtStatus;
  }) {
    this.DebtId = props.DebtId;
    this.BillId = props.BillId;
    this.UserId = props.UserId;
    this.AmountOwed = props.AmountOwed;
    this.Status = props.Status;
  }

  public static create(props: {
    DebtId: number;
    BillId: number;
    UserId: number;
    AmountOwed: number;
    Status: debtStatus;
  }) : Debt {
    return new Debt(props)
  }

  public markAsPaid() {
    if (this.Status === debtStatus.UNPAID) {
      this.Status = debtStatus.PAID;
      // TODO: Message Broker Event (Publish an event here using Kafka)
    }
  }
}

export enum debtStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}
