import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { Project } from './project.entity';
import { ProjectFilterDto } from './dto/project-filter.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAllWithFilters(filterDto: ProjectFilterDto) {
    // Добавляем значения по умолчанию для пагинации
    const page = filterDto.page ?? 1; // Если undefined, то 1
    const limit = filterDto.limit ?? 10; // Если undefined, то 10

    const {
      title,
      initiator,
      techStack,
      ideaStatus,
      teamSizeFrom,
      teamSizeTo,
      rewardFrom,
      rewardTo,
      category,
      difficulty,
      deadlineFrom,
      deadlineTo,
      rewardType
    } = filterDto;

    const where: any = {};

    if (title) where.title = Like(`%${title}%`);
    if (initiator) where.initiator = Like(`%${initiator}%`);
    if (techStack) where.techStack = In(techStack);
    if (ideaStatus) where.ideaStatus = ideaStatus;
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (rewardType) where.rewardType = rewardType;

    if (teamSizeFrom || teamSizeTo) {
      where.teamSize = Between(
        teamSizeFrom ?? 1,  // Используем ?? вместо ||
        teamSizeTo ?? 100
      );
    }

    if (rewardFrom || rewardTo) {
      where.reward = Between(
        rewardFrom ?? 0,
        rewardTo ?? Number.MAX_SAFE_INTEGER
      );
    }

    if (deadlineFrom || deadlineTo) {
      where.deadline = Between(
        deadlineFrom ? new Date(deadlineFrom) : new Date(0),
        deadlineTo ? new Date(deadlineTo) : new Date(8640000000000000)
      );
    }

    const skip = (page - 1) * limit;
    
    // Добавляем обработку ошибок
    try {
      const [projects, total] = await Promise.all([
        this.projectRepository.find({
          where,
          skip,
          take: limit,
        }),
        this.projectRepository.count({ where }),
      ]);

      return {
        data: projects,
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