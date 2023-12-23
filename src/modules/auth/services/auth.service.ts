import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateJwt(user: UserEntity) {
    const payload = {
      username: user.name,
      email: user.email,
    };
    const jwt = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_KEY'),
    });

    return { payload, jwt };
  }

  decodeJwt(jwt: string) {
    return this.jwtService.verify(jwt, {
      secret: this.configService.get('SECRET_KEY'),
    });
  }
}
