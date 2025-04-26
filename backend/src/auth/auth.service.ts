import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  LoginResponseDto,
  SecuredUser,
  SignUpRequestDto,
  Role,
  UserAccountStatus
} from 'src/common/types';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/orm/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Omit<SecuredUser, 'token'> | null> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const passwordIsCorrect = await bcrypt.compare(pass, user.passwordHash);
      if (passwordIsCorrect) {
        // Специальная проверка для админа
        if (username === 'admin@example.com') {
          user.roles = [Role.admin];
        }
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: SecuredUser): Promise<LoginResponseDto> {
    const payload = { username: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      roles: user.roles,
      userId: user.id,
    };
  }

  async signup(payload: SignUpRequestDto): Promise<User> {
    const existingUser = await this.usersService.findOne(payload.username);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    try {
      return await this.usersService.create(
        payload.username,
        payload.password,
        payload.firstname,
        payload.lastname,
        [Role.user], // Роль по умолчанию
        UserAccountStatus.active // Статус по умолчанию
      );
    } catch (error) {
      this.logger.error(`Ошибка при создании пользователя: ${error.message}`);
      throw new ConflictException('Не удалось создать пользователя');
    }
  }
}
