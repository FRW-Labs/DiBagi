import { UserResponse } from '../model/response/user.response';

export class User {
  public readonly UserId: number;
  public readonly Username: string;
  public readonly Name: string;
  public readonly Email: string;
  public readonly Password: string; // TODO: nanti hash password-nya
  public readonly CreatedAt: Date;
  public readonly hashedRefreshToken?: string | null;

  // private constructor (object should only be created using factory method)
  private constructor(props: {
    UserId: number;
    Username: string;
    Name: string;
    Email: string;
    Password: string;
    CreatedAt: Date;
    hashedRefreshToken?: string | null;
  }) {
    this.UserId = props.UserId;
    this.Username = props.Username;
    this.Name = props.Name;
    this.Email = props.Email;
    this.Password = props.Password;
    this.CreatedAt = new Date(props.CreatedAt);
    this.hashedRefreshToken = props.hashedRefreshToken;
  }

  // to create an object: call this method
  public static create(props: {
    UserID: number;
    Username: string;
    Name: string;
    Email: string;
    Password: string;
    CreatedAt?: Date;
    hashedRefreshToken?: string | null;
  }) : User {
    const userProps = {
      ...props,
      UserId: props.UserID,
      CreatedAt: props.CreatedAt ?? new Date(),
    }

    // TODO: add other logic validation for email, username, etc.

    return new User(userProps);
  }
}