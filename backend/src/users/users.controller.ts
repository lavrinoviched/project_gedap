import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { 
  CreateUserDto, 
  Role, 
  UpdateUserDto, 
  UpdateProfileDto, 
  UserAccountStatus
} from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  // Административные методы
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() body: CreateUserDto) {
    const createdUser = await this.usersService.create(
      body.email,
      body.password,
      body.firstname,
      body.lastname,
      body.roles,
      body.status,
    );
    return createdUser.getSecuredDto();
  }

  @Post(':id/status')
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async setUserStatus(@Param('id') id: number, @Body() body: { value: UserAccountStatus }) {
    return this.usersService.setStatus(id, body.value);
  }

  // Методы работы с профилем
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: number) {
    const user = await this.usersService.findOneById(id);
    if (user) return user.getSecuredDto();
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('id') id: number) {
    return this.usersService.getProfile(id);
  }

  @Put(':id/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, dto);
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const avatarPath = `/uploads/avatars/${avatar.filename}`;
    return this.usersService.updateProfile(id, { avatarPath });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() payload: UpdateUserDto) {
    return this.usersService.update(id, payload);
  }
}