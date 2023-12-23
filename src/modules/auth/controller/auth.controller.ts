import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/services/user.service';
import { validatePassword } from 'src/utils/hashing.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async create(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.userService.getByUsernameOrEmail(
      createAuthDto.usernameOrEmail,
    );

    if (!user)
      throw new BadRequestException({
        message: 'username or email or password is not valid',
      });

    if (!user.password)
      throw new BadRequestException({
        message: 'user is not valid',
      });

    if (!validatePassword(createAuthDto.password, user.password))
      throw new BadRequestException({
        message: 'username or email or password is not valid',
      });

    const result = this.authService.generateJwt(user);

    return {
      message: 'success',
      data: result,
    };
  }
}
