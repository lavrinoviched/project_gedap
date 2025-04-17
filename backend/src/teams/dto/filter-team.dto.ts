import { IsOptional, IsEnum, IsString, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum StatusTeam {
    recruiting = 'Ищут участников',
    active = 'Активно рабоатют',
    inactive = 'Не активна'
  }
      
  export enum PrivacyTeam {
    open = 'Открытые команды',
    closed = 'Закрытые команды'
  }

export enum CompetenciesOptions {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  DESIGN = 'Дизайн',
  ANALYTICS = 'Аналитика',
  MANAGEMENT = 'Менеджмент'
}

export const TechnologiesOptions = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++',
  'PHP', 'GOLANG', 'Rust', 'Dart', 'R Lang', 'KOTLIN', 'SWIFT', 'Julia', 'XAML',
  'Node.js', 'React', 'ReactJS', 'Vue', 'Next.js', 'Next', 'SpringBoot', 'Flutter',
  'Django', 'FastAPI', 'NestJS', '.NET 6.0', '.NET MAUI', 'Unreal Engine', 'Blueprint',
  'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'SQLite', 'FireBase', 'Redis', 'Elasticsearch',
  'Git', 'Docker', 'Prometheus', 'Grafana', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit Learn',
  'Pandas', '1c', 'Android SDK', 'Figma', 'Photoshop', 'Selenium', 'Jest', 'Jupyter'
] as const;

export type TechnologiesOptions = typeof TechnologiesOptions[number];

export class FilterTeamDto {
  @ApiPropertyOptional({ description: 'Поиск по названию...' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    enum: PrivacyTeam,
    description: 'Тип команды',
    example: PrivacyTeam.open
  })
  @IsOptional()
  @IsEnum(PrivacyTeam)
  privacy?: PrivacyTeam;

  @ApiPropertyOptional({
    enum: StatusTeam,
    description: 'Статус команды',
    example: StatusTeam.recruiting
  })
  @IsOptional()
  @IsEnum(StatusTeam)
  status?: StatusTeam;

  @ApiPropertyOptional({
    enum: CompetenciesOptions,
    isArray: true,
    description: 'Необходимые компетенции'
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CompetenciesOptions, { each: true })
  competencies?: CompetenciesOptions[];

  @ApiPropertyOptional({
    enum: TechnologiesOptions,
    isArray: true,
    description: 'Используемые технологии'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @ApiPropertyOptional({ description: 'Искать только команды с открытыми вакансиями' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasVacancies?: boolean;

  @ApiPropertyOptional({ description: 'Искать только команды с активным проектом' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasActiveProject?: boolean;

  @ApiPropertyOptional({ description: 'Поиск по нескольким полям (название, описание)' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsNumber()
  user_leaderId?: number;
}