import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User } from '../entity/user.entity';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    // step 1: define query-nya
    const dataToSave = {
      Username: user.Username,
      Name: user.Name,
      Email: user.Email,
      Password: user.Password,
    }

    // step 2: execute query by prisma
    const createdUserToDB = await this.prisma.user.create({
      data: dataToSave,
    })

    // step 3: scan hasil-nya ke entity user
    return User.create(createdUserToDB)
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { UserID: userId },
      data: { hashedRefreshToken: refreshToken }
    })

  }
}