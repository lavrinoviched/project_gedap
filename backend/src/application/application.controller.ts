import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { Application } from '../orm/application.entity';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto): Promise<Application> {
    return this.applicationService.createApplication(createApplicationDto);
  }

  @Get()
  async findAll(): Promise<Application[]> {
    return this.applicationService.getAllApplications();
  }
}