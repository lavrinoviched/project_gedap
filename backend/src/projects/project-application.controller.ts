import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ProjectApplicationsService } from './project-application.service';
import { ProjectApplication } from './project-application.entity';

@Controller('project-applications')
export class ProjectApplicationsController {
  constructor(private readonly service: ProjectApplicationsService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() application: Partial<ProjectApplication>) {
    return this.service.create(application);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() body: { status: 'approved' | 'rejected' }
  ) {
    return this.service.updateStatus(id, body.status);
  }
}