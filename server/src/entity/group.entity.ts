import { User } from './user.entity';

export class Group {
  public readonly GroupId: number;
  public readonly Name: string;
  public readonly Description: string;
  public readonly CreatedBy: string;
  public readonly CreatedAt: Date;
  private userIds: number[] // User-user kita tampung disini dalam bentuk ID

  private constructor(props: {
    GroupId: number;
    Name: string;
    Description: string;
    CreatedBy: string;
    CreatedAt: Date;
    userIds: number[]
  }) {
    this.GroupId = props.GroupId;
    this.Name = props.Name;
    this.Description = props.Description;
    this.CreatedBy = props.CreatedBy;
    this.CreatedAt = props.CreatedAt;
    this.userIds = props.userIds;
  }

  public static create(props: {
    GroupId: number;
    Name: string;
    Description?: string;
    CreatedBy: string;
    CreatedAt?: Date;
    userIds?: number[];
  }) : Group {
    const groupProps = {
      ...props,
      Description: props.Description ?? "",
      CreatedAt: props.CreatedAt ?? new Date(),
      userIds: props.userIds ?? [],
    }

    return new Group(groupProps);
  }

  public addMember(userId: number) {
    if (!this.userIds.includes(userId)) {
      this.userIds.push(userId);
    }
  }

  public removeMember(userId: number) {
    this.userIds = this.userIds.filter(id => id !== userId);
  }

  public getMembers(): number[] {
    return [...this.userIds];
  }
}