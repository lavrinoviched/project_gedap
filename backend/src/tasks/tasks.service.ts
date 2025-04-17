import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateTaskDto } from 'src/common/types';
import { Task } from 'src/orm/task.entity';
import { User } from 'src/orm/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(createTaskDto: CreateUpdateTaskDto, user: any) {
    // Проверка наличия assignee в DTO
    if (!createTaskDto.assignee?.id) {
      throw new Error('Assignee ID is required');
    }

    const authorUser = await this.usersService.findOneById(user.userId);
    if (!authorUser) {
      throw new NotFoundException('Author user not found');
    }

    const assigneeUser = await this.usersService.findOneById(createTaskDto.assignee.id);
    if (!assigneeUser) {
      throw new NotFoundException('Assignee user not found');
    }

    const newTask = this.taskRepository.create({
      title: createTaskDto.title,
      status: createTaskDto.status,
      author: authorUser,
      assignee: assigneeUser,
    });

    await this.taskRepository.save(newTask);
    return newTask.getDto();
  }

  async findAll(user: any) {
    return await this.taskRepository.find({
      where: { author: { id: user.userId } },
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: CreateUpdateTaskDto) {
    // Проверка наличия assignee в DTO
    if (!updateTaskDto.assignee?.id) {
      throw new Error('Assignee ID is required');
    }

    const existedTask = await this.findOne(id); // здесь уже есть проверка на существование
    const assigneeUser = await this.usersService.findOneById(updateTaskDto.assignee.id);
    if (!assigneeUser) {
      throw new NotFoundException('Assignee user not found');
    }

    existedTask.title = updateTaskDto.title;
    existedTask.status = updateTaskDto.status;
    existedTask.assignee = assigneeUser;

    await this.taskRepository.save(existedTask);
    return existedTask.getDto();
  }

  async remove(id: number) {
    const result = await this.taskRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}