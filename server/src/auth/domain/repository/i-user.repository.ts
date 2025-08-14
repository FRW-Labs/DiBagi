import { User } from '../entity/user.entity';

export interface IUserRepository {
  // Auth
  save(user: User): Promise<User>

  // Get User
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
}

// biar bisa @Inject() <- cuman nerima value bukan type
export const IUserRepository = Symbol('IUserRepository');