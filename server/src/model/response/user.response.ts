import { ApiProperty } from '@nestjs/swagger';
import { User } from "../../entity/user.entity";

export class UserResponse {
  @ApiProperty({
    description: 'User ID',
    format: 'number',
    example: '1',
  })
  UserId: number;

  @ApiProperty({
    description: 'Username',
    format: 'text',
    example: 'admantix',
  })
  Username: string;

  @ApiProperty({
    description: 'Nama lengkap',
    format: 'text',
    example: 'William Theodorus',
  })
  Name: string;

  @ApiProperty({
    description: 'Email',
    format: 'email',
    example: 'admantix@gmail.com'
  })
  Email: string;

  @ApiProperty({
    description: 'Date time account was created',
    format: 'date',
    example: '2017-07-10T00:00:00.000Z',
  })
  CreatedAt: Date;


  // function buat ubah entity -> response
  static convertToResponse(user: User): UserResponse {
    const dto = new UserResponse();
    dto.UserId = user.UserID
    dto.Username = user.Username
    dto.Name = user.Name
    dto.Email = user.Email
    dto.CreatedAt = user.CreatedAt
    return dto;
  }
}

export class LoginResponse {
  @ApiProperty({
    description: 'JWT Token',
    format: 'json',
  })
  Token: string;

  static convertToResponse(token: string): LoginResponse {
    const dto = new LoginResponse();
    dto.Token = token;
    return dto;
  }
}