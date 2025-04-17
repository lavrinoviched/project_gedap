import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationRequest } from '../orm/application-request.entity';
import { CreateApplicationRequestDto } from '../request/dto/create-application-request.dto';

@Injectable()
export class ApplicationRequestService {
  constructor(
    @InjectRepository(ApplicationRequest)
    private applicationRequestRepository: Repository<ApplicationRequest>,
  ) {}

  async create(createDto: CreateApplicationRequestDto) {
    if (createDto.budget && createDto.budget < 0) {
      throw new BadRequestException('Бюджет не может быть отрицательным');
    }

    const application = this.applicationRequestRepository.create(createDto);
    return this.applicationRequestRepository.save(application);
  }
}