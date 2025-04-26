import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Competence } from '../../common/types';

export class CreateIdeaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  problem: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsString()
  resource?: string;

  @IsArray()
  @IsOptional()
  stack: Competence[];

  @IsOptional()
  @IsString()
  category?: string;
}