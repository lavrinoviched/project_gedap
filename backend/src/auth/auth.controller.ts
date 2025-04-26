import {
  Controller,
  Request,
  Post,
  UseGuards,
  Logger,
  HttpCode,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignUpRequestDto } from 'src/common/types';
import { User } from 'src/orm/user.entity'; // Добавьте этот импорт

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() payload: SignUpRequestDto) {
    const user = await this.authService.signup(payload);
    if (user instanceof User) { // Проверяем тип
      return user.getSecuredDto();
    }
    return user;
  }
}
