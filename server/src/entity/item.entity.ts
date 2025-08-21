export class Item {
  public readonly ItemId: string; // rencana keknya pake UUID aja di generate
  public readonly BillId: number;
  public readonly Name: string;
  public readonly Price: number;
  private userIds: number[]; // isi-nya userIds (many-to-many) relationship mirip kek User <-> Group

  private constructor(props: {
    ItemId: string;
    BillId: number;
    Name: string;
    Price: number;
    userIds: number[];
  }) {
    this.ItemId = props.ItemId;
    this.BillId = props.BillId;
    this.Name = props.Name;
    this.Price = props.Price;
    this.userIds = props.userIds;
  }

  public static new(props: {
    Name: string;
    Price: number;
    BillId: number;
    userIds: number[];
  }): Item {
    return new Item({
      ...props,
      ItemId: 'ini ceritanya id (default dulu aja karena bakal di set sama DB', // default value for creation only
    })
  }

  public static from(props: {
    ItemId: string;
    BillId: number;
    Name: string;
    Price: number;
    userIds?: number[];
  }) : Item {
    return new Item({
      ...props,
      userIds: props.userIds ?? [],
    })
  }

  public addUser(userId: number) {
    if (!this.userIds.includes(userId)) {
      this.userIds.push(userId);
    }
  }

  public removeUser(userId: number) {
    this.userIds = this.userIds.filter(id => id !== userId);
  }

  public getUsers(): number[] {
    return [...this.userIds];
  }
}