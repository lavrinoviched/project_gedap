import { IsOptional, IsString, Min, Max, IsNumber, IsDateString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProjectFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  initiator?: 'Все' | 'Сотрудник вуза' | 'Партнер вуза';

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.split(','))
  techStack?: string[];

  @IsOptional()
  @IsString()
  status?: 'Все' | 'Открыта' | 'В работе' | 'Завершена';

  @IsOptional()
  @IsString()
  teamSize?: 'Все' | '1-2 человека' | '2-3 человека' | '3-4 человека' | '4-5 человек';

  @IsOptional()
  @IsString()
  hasReward?: 'Все' | 'Практика в организации' | 'Денежная' | 'Сертификат' | 'Приглашение на работу';

  @IsOptional()
  @IsString()
  category?: 'Все' | 'Программирование' | 'Аналитика' | 'Дизайн' | 'Документирование' | 'Тестирование' | 'Обучение';

  @IsOptional()
  @IsString()
  complexity?: 'Все' | 'Низкая' | 'Средняя' | 'Высокая';

  @IsOptional()
  @IsString()
  rewardType?: 'Все' | 'Денежная' | 'Сертификат' | 'Рекомендация' | 'Благодарность';

  @IsOptional()
  @IsDateString()
  deadlineFrom?: string;

  @IsOptional()
  @IsDateString()
  deadlineTo?: string;

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