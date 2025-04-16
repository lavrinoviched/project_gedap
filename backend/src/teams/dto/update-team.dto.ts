import { 
    IsOptional, 
    IsString, 
    IsEnum, 
    IsNumber, 
    IsArray, 
    IsBoolean,
    ValidateNested,
    ArrayNotEmpty
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiPropertyOptional } from '@nestjs/swagger';
  import { 
    PrivacyTeam, 
    StatusTeam,
    Competence,
    Technology
  } from '../../common/types';
  
  export class UpdateTeamUserDto {
    @IsNumber()
    @ApiPropertyOptional({ description: 'ID пользователя' })
    id: number;
  
    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Сделать пользователя лидером' })
    makeLeader?: boolean;
  }
  
  export class UpdateTeamProjectDto {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'ID проекта для привязки' })
    id?: number;
  
    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Отвязать текущий проект' })
    unassign?: boolean;
  }
  
  export class UpdateTeamDto {
    @ApiPropertyOptional({ description: 'Новое название команды' })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiPropertyOptional({ description: 'Новое описание команды' })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiPropertyOptional({ 
      enum: PrivacyTeam,
      description: 'Изменение уровня приватности' 
    })
    @IsOptional()
    @IsEnum(PrivacyTeam)
    privacy?: PrivacyTeam;
  
    @ApiPropertyOptional({ 
      enum: StatusTeam,
      description: 'Изменение статуса команды' 
    })
    @IsOptional()
    @IsEnum(StatusTeam)
    status?: StatusTeam;
  
    @ApiPropertyOptional({ 
      description: 'ID нового лидера команды',
      example: 1
    })
    @IsOptional()
    @IsNumber()
    newLeaderId?: number;
  
    @ApiPropertyOptional({
      type: [UpdateTeamUserDto],
      description: 'Обновление состава участников'
    })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateTeamUserDto)
    users?: UpdateTeamUserDto[];
  
    @ApiPropertyOptional({
      type: UpdateTeamProjectDto,
      description: 'Обновление привязанного проекта'
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateTeamProjectDto)
    project?: UpdateTeamProjectDto;
  
    @ApiPropertyOptional({
      enum: Competence,
      isArray: true,
      description: 'Обновление списка компетенций'
    })
    @IsOptional()
    @IsArray()
    @IsEnum(Competence, { each: true })
    competencies?: Competence[];
  
    @ApiPropertyOptional({
      description: 'Обновление списка технологий',
      example: ['React', 'Node.js']
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: Technology[];
  
    @ApiPropertyOptional({ 
      description: 'Флаг для удаления текущего аватара',
      default: false
    })
    @IsOptional()
    @IsBoolean()
    removeAvatar?: boolean = false;
  }