import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Project } from './project.entity';
import { ProjectFilterDto } from './dto/project-filter.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAllWithFilters(filterDto: ProjectFilterDto) {
    const page = filterDto.page ?? 1;
    const limit = filterDto.limit ?? 10;

    const {
      title,
      initiator,
      techStack,
      status,
      teamSize,
      category,
      complexity,
      rewardType,
      deadlineFrom,
      deadlineTo,
      hasReward,
    } = filterDto;

    const where: any = {};

    // Текстовые фильтры
    if (title) where.title = Like(`%${title}%`);
    if (initiator) where.initiator = Like(`%${initiator}%`);
    if (status) where.status = status;
    if (category) where.category = category;
    if (complexity) where.complexity = complexity;

    // Фильтр по технологиям
    if (techStack) {
      where.technologies = In(techStack);
    }

    // Фильтр по наличию вознаграждения
    if (hasReward !== undefined) {
      where.hasReward = hasReward;
    }

    // Фильтр по размеру команды
    if (teamSize) {
      where.teamSize = teamSize;
    }

   
    // Фильтр по датам
    if (deadlineFrom || deadlineTo) {
      where.deadline = Between(
        deadlineFrom ? new Date(deadlineFrom) : new Date(0),
        deadlineTo ? new Date(deadlineTo) : new Date(8640000000000000)
      );
    }

    const skip = (page - 1) * limit;
    
    try {
      const [projects, total] = await Promise.all([
        this.projectRepository.find({
          where,
          skip,
          take: limit,
          order: { deadline: 'ASC' } // Сортировка по сроку выполнения
        }),
        this.projectRepository.count({ where }),
      ]);

      return {
        data: projects.map(project => ({
          ...project,
          deadline: project.deadline.toISOString().split('T')[0] // Форматирование даты
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
  }
}