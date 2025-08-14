import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../application/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JKOb7uA7H7DTP14',
    });
  }

  // Method ini akan dijalankan oleh NestJS setelah token berhasil diverifikasi
  async validate(payload: { sub: number; username: string }) {
    // 'sub' adalah ID user yang kita masukkan saat membuat token di AuthService
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Objek yang di-return di sini akan ditambahkan ke object Request
    return user;
  }
}