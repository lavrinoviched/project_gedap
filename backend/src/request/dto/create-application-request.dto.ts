import { IsString, IsEmail, IsPhoneNumber, IsDateString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateApplicationRequestDto {
  @IsString()
  @MinLength(5)
  projectName: string;

  @IsString()
  @MinLength(200)
  description: string;

  @IsEmail()
  contactEmail: string;

  @IsPhoneNumber('RU')
  contactPhone: string;

  @IsDateString()
  desiredDeadline: Date;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsOptional()
  files?: string[];

  @IsString()
  @IsOptional()
  comments?: string;
}