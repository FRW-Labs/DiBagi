import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    // step 1: define & execute query
    const userFromDb = await this.prisma.user.findUnique({
      where: { UserID: id }
    })

    // step 2: handle if not found
    if (!userFromDb) {
      return null;
    }

    // step 3: convert to entity and return
    return User.create(userFromDb)
  }

  async findByEmail(email: string): Promise<User | null> {
    const userFromDb = await this.prisma.user.findUnique({
      where: { Email: email }
    })

    if (!userFromDb) {
      return null;
    }

    return User.create(userFromDb)
  }

  async findByUsername(username: string): Promise<User | null> {
    const userFromDb = await this.prisma.user.findUnique({
      where: { Username: username }
    })

    if (!userFromDb) {
      return null;
    }

    return User.create(userFromDb)
  }
}