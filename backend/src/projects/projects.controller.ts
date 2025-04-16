import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiQuery({ name: 'title', required: false, description: 'Название проекта' })
  @ApiQuery({ 
    name: 'initiator', 
    required: false, 
    enum: ['Все', 'Сотрудник вуза', 'Партнер вуза'],
    description: 'Тип инициатора проекта'
  })
  @ApiQuery({ 
    name: 'techStack', 
    required: false, 
    description: 'Технологии (через запятую)' 
  })
  @ApiQuery({ 
    name: 'ideaStatus', 
    required: false, 
    enum: ['Все', 'Открыта', 'В работе', 'Завершена'],
    description: 'Статус идеи'
  })
  @ApiQuery({ 
    name: 'teamSize', 
    required: false, 
    enum: ['Все', '1-2 человека', '2-3 человека', '3-4 человека', '4-5 человек'],
    description: 'Размер команды'
  })
  @ApiQuery({ 
    name: 'hasReward', 
    required: false, 
    enum: ['Все', 'Практика в организации', 'Денежная', 'Сертификат', 'Приглашение на работу'],
    description: 'Наличие вознаграждения'
  })
  @ApiQuery({ 
    name: 'category', 
    required: false, 
    enum: ['Все', 'Программирование', 'Аналитика', 'Дизайн', 'Документирование', 'Тестирование', 'Обучение'],
    description: 'Категория проекта'
  })
  @ApiQuery({ 
    name: 'complexity', 
    required: false, 
    enum: ['Все', 'Низкая', 'Средняя', 'Высокая'],
    description: 'Сложность проекта'
  })
  @ApiQuery({ 
    name: 'rewardType', 
    required: false, 
    enum: ['Все', 'Денежная', 'Сертификат', 'Рекомендация', 'Благодарность'],
    description: 'Тип вознаграждения'
  })
  @ApiQuery({ 
    name: 'deadlineFrom', 
    required: false, 
    description: 'Минимальная дата дедлайна (YYYY-MM-DD)' 
  })
  @ApiQuery({ 
    name: 'deadlineTo', 
    required: false, 
    description: 'Максимальная дата дедлайна (YYYY-MM-DD)' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number,
    description: 'Номер страницы (по умолчанию 1)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Лимит проектов на странице (по умолчанию 10)' 
  })
  @ApiResponse({ status: 200, description: 'Отфильтрованный список проектов' })
  async findAll(@Query() filterDto: ProjectFilterDto) {
    return this.projectsService.findAllWithFilters(filterDto);
  }
}