export class User {
  public readonly UserID: number;
  public readonly Username: string;
  public readonly Name: string;
  public readonly Email: string;
  public readonly Password: string; // TODO: nanti hash password-nya
  public readonly CreatedAt: Date;

  // private constructor (object should only be created using factory method)
  private constructor(props: {
    UserID: number;
    Username: string;
    Name: string;
    Email: string;
    Password: string;
    CreatedAt: Date;
  }) {
    this.UserID = props.UserID;
    this.Username = props.Username;
    this.Name = props.Name;
    this.Email = props.Email;
    this.Password = props.Password;
    this.CreatedAt = new Date(props.CreatedAt);
  }

  // to create an object: call this method
  public static create(props: {
    UserID: number;
    Username: string;
    Name: string;
    Email: string;
    Password: string;
    CreatedAt?: Date;
  }) : User {
    const userProps = {
      ...props,
      CreatedAt: props.CreatedAt ?? new Date(),
    }

    // TODO: add other logic validation for email, username, etc.

    return new User(userProps);
  }
}