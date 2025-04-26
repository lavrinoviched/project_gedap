import { IsOptional, IsEmail, IsString, IsArray, IsEnum } from 'class-validator';
import { Role, UserAccountStatus } from '../types';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsEnum(UserAccountStatus)
  status?: UserAccountStatus;

  @IsOptional()
  @IsString()
  group?: string;
}