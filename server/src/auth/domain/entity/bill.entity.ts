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
  }

  public static create(props: {
    GroupId: number;
    BillId: number;
    Title: string;
    BillDate?: Date;
    TotalAmount: number;
    TaxAndService?: number;
    Discount?: number;
    ReceiptURL?: string;
    itemIds?: string[];
  }) : Bill {
    return new Bill({
      ...props,
      BillDate: props.BillDate ?? new Date(),
      TaxAndService: props.TaxAndService ?? 0,
      Discount: props.Discount ?? 0,
      ReceiptURL: props.ReceiptURL ?? "",
      itemIds: props.itemIds ?? [],
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
}