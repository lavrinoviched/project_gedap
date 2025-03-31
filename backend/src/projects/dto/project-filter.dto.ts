import { IsOptional, IsString, Min, Max, IsNumber, IsDateString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProjectFilterDto {
  
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  initiator?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.split(','))
  techStack?: string[];

  @IsOptional()
  @IsString()
  ideaStatus?: string;

  @IsOptional()
  @IsNumber()
  teamSizeFrom?: number;

  @IsOptional()
  @IsNumber()
  teamSizeTo?: number;

  @IsOptional()
  @IsNumber()
  rewardFrom?: number;

  @IsOptional()
  @IsNumber()
  rewardTo?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsDateString()
  deadlineFrom?: string;

  @IsOptional()
  @IsDateString()
  deadlineTo?: string;

  @IsOptional()
  @IsString()
  rewardType?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}