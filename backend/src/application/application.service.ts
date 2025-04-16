import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../orm/application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async createApplication(createApplicationDto: CreateApplicationDto): Promise<Application> {
    // Валидация уже выполнена через DTO, поэтому просто создаем заявку
    const application = this.applicationRepository.create({
      name: createApplicationDto.name,
      phone: createApplicationDto.phone,
      email: createApplicationDto.email,
      comment: createApplicationDto.comment,
      status: 'pending', // Устанавливаем статус по умолчанию
      createdAt: new Date(), // Текущая дата и время
    });

    try {
      return await this.applicationRepository.save(application);
    } catch (error) {
      // Более специфичная обработка ошибок
      if (error.code === '23505') { // Ошибка уникальности
        throw new Error('Заявка с таким email уже существует');
      }
      throw new Error(`Не удалось сохранить заявку: ${error.message}`);
    }
  }

  async getAllApplications(): Promise<Application[]> {
    return this.applicationRepository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'phone', 'status', 'createdAt'], // Выбираем только нужные поля
    });
  }

  async getApplicationById(id: number): Promise<Application> {
    const application = await this.applicationRepository.findOne({ 
      where: { id },
      relations: ['relatedEntity'], // Если есть связанные сущности
    });
    
    if (!application) {
      throw new Error('Заявка не найдена');
    }
    
    return application;
  }
}