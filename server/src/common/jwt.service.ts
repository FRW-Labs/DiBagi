import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
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

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}