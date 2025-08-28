export class Item {
  public readonly ItemId: string; // rencana keknya pake UUID aja di generate
  public readonly UserId: number[];
  public readonly BillId: number;
  public readonly Name: string;
  public readonly Price: number;

  private constructor(props: {
    ItemId: string;
    BillId: number;
    Name: string;
    Price: number;
    UserId: number[];
  }) {
    this.ItemId = props.ItemId;
    this.BillId = props.BillId;
    this.Name = props.Name;
    this.Price = props.Price;
    this.UserId = props.UserId;
  }

  public static new(props: {
    BillId: number;
    UserId: number[];
    Name: string;
    Price: number;
  }): Item {
    return new Item({
      ...props,
      ItemId: 'ini ceritanya id (default dulu aja karena bakal di set sama DB', // default value for creation only
    })
  }

  public static from(props: {
    ItemId: string;
    BillId: number;
    UserId: number[];
    Name: string;
    Price: number;
  }) : Item {
    return new Item({
      ...props,
    })
  }
}