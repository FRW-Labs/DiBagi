export class Bill {
  public readonly GroupId: number;
  public readonly BillId: number;
  public readonly Title: string;
  public readonly BillDate: Date;
  public readonly TotalAmount: number;
  public readonly TaxAndService: number;
  public readonly Discount: number;
  public readonly ReceiptURL: string;
  private itemIds: string[];
  private debtIds: number[];

  private constructor(props: {
    GroupId: number;
    BillId: number;
    Title: string;
    BillDate: Date;
    TotalAmount: number;
    TaxAndService: number;
    Discount: number;
    ReceiptURL: string;
    itemIds: string[];
    debtIds: number[];
  }) {
    this.GroupId = props.GroupId;
    this.BillId = props.BillId;
    this.Title = props.Title;
    this.BillDate = props.BillDate;
    this.TotalAmount = props.TotalAmount;
    this.TaxAndService = props.TaxAndService;
    this.Discount = props.Discount;
    this.ReceiptURL = props.ReceiptURL;
    this.itemIds = props.itemIds;
    this.debtIds = props.debtIds;
  }

  public static new(props: {
    Title: string;
    TaxAndService?: number;
    Discount?: number;
    ReceiptURL?: string;
  }) : Bill {
    return new Bill({
      ...props,
      GroupId: 0,
      BillId: 0,
      BillDate: new Date(),
      TotalAmount: 0,
      TaxAndService: props.TaxAndService ?? 0,
      Discount: props.Discount ?? 0,
      ReceiptURL: props.ReceiptURL ?? "",
      itemIds: [],
      debtIds: [],
    })
  }

  public static from(props: {
    GroupId: number;
    BillId: number;
    Title: string;
    BillDate: Date;
    TotalAmount: number;
    TaxAndService?: number;
    Discount?: number;
    ReceiptURL?: string;
    itemIds?: string[];
    debtIds?: number[];
  }) : Bill {
    return new Bill({
      ...props,
      itemIds: props.itemIds ?? [],
      debtIds: props.debtIds ?? [],
      TaxAndService: props.TaxAndService ?? 0,
      Discount: props.Discount ?? 0,
      ReceiptURL: props.ReceiptURL ?? "",
    })
  }

  public addItem(itemId: string) {
    if (!this.itemIds.includes(itemId)) {
      this.itemIds.push(itemId);
    }
  }

  public removeItem(itemId: string) {
    this.itemIds = this.itemIds.filter(id => id !== itemId);
  }

  public getItems(): string[] {
    return [...this.itemIds];
  }

  public addDebt(debtId: number) {
    if (!this.debtIds.includes(debtId)) {
      this.debtIds.push(debtId);
    }
  }

  public removeDebt(debtId: number) {
    this.debtIds = this.debtIds.filter(id => id !== debtId);
  }

  public getDebts(): number[] {
    return [...this.debtIds];
  }
}