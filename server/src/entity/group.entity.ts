import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';

export class Group {
  public readonly GroupId: number;
  public readonly Name: string;
  public readonly Description: string;
  public readonly CreatedBy: string;
  public readonly CreatedAt: Date;
  private userIds: number[]; // User-user kita tampung disini dalam bentuk ID

  private constructor(props: {
    GroupId: number;
    Name: string;
    Description: string;
    CreatedBy: string;
    CreatedAt: Date;
    userIds: number[];
  }) {
    this.GroupId = props.GroupId;
    this.Name = props.Name;
    this.Description = props.Description ?? '';
    this.CreatedBy = props.CreatedBy;
    this.CreatedAt = props.CreatedAt;
    this.userIds = props.userIds;
  }

  public static new(props: {
    Name: string;
    Description: string | null;
    CreatedBy: string;
  }): Group {
    return new Group({
      ...props,
      GroupId: 0, // ID sementara, karena belum ada di DB
      Description: props.Description ?? '',
      CreatedAt: new Date(),
      userIds: [],
    });
  }

  public static from(props: {
    GroupId: number;
    Name: string;
    Description: string | null;
    CreatedBy: string;
    CreatedAt: Date;
    userIds?: number[];
  }): Group {
    return new Group({
      ...props,
      Description: props.Description ?? '',
      userIds: props.userIds ?? [],
    });
  }

  public addMember(userId: number) {
    if (!this.userIds.includes(userId)) {
      this.userIds.push(userId);
    } else {
      throw new ConflictException(`User with id ${userId} is already a member`)
    }
  }

  public removeMember(userId: number) {
    this.userIds = this.userIds.filter((id) => id !== userId);
  }

  public getMembers(): number[] {
    return [...this.userIds];
  }
}