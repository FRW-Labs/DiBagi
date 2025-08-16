import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  // 1. inisialisasi Prisma ORM
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