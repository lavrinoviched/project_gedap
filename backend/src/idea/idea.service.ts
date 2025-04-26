import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Idea } from '../orm/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { User } from '../orm/user.entity';
import { StatusIdea } from '../common/types';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private ideaRepository: Repository<Idea>,
  ) {}

  async create(createIdeaDto: CreateIdeaDto, user: User): Promise<Idea> {
    const idea = this.ideaRepository.create({
      ...createIdeaDto,
      customer: user,
      status: StatusIdea.new,
      // Добавляем дефолтные значения для опциональных полей
      solution: createIdeaDto.solution || 'Решение не указано',
      result: createIdeaDto.result || 'Ожидается результат',
      resource: createIdeaDto.resource || 'Ресурсы не указаны',
      stack: createIdeaDto.stack || []
    });
    return this.ideaRepository.save(idea);
  }

  async findAll(filters?: {
    search?: string;
    status?: string;
    stack?: string;
  }): Promise<Idea[]> {
    const query = this.ideaRepository
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.customer', 'customer')
      .orderBy('idea.createdAt', 'DESC');

    if (filters?.search) {
      query.where('idea.name LIKE :search', { search: `%${filters.search}%` });
    }

    if (filters?.status) {
      query.andWhere('idea.status = :status', { status: filters.status });
    }

    if (filters?.stack) {
      query.andWhere(':stack = ANY(idea.stack)', { stack: filters.stack });
    }

    return query.getMany();
  }
}