import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, ArrayNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PrivacyTeam, StatusTeam } from '../../common/types';

export class CreateTeamUserDto {
  @IsNumber()
  id: number;
}

export class CreateTeamProjectDto {
  @IsNumber()
  @IsOptional()
  id?: number;
}

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PrivacyTeam)
  @IsOptional()
  privacy?: PrivacyTeam = PrivacyTeam.open;

  @IsEnum(StatusTeam)
  @IsOptional()
  status?: StatusTeam = StatusTeam.recruiting;

  @IsNumber()
  @IsNotEmpty()
  user_leaderId: number;

  @IsNumber()
  @IsOptional()
  user_ownerId?: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamUserDto)
  @IsOptional()
  users?: CreateTeamUserDto[];

  @ValidateNested()
  @Type(() => CreateTeamProjectDto)
  @IsOptional()
  project?: CreateTeamProjectDto;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;
}