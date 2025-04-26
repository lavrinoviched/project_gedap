import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectApplication } from './project-application.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class ProjectApplicationsService {
  constructor(
    @InjectRepository(ProjectApplication)
    private applicationsRepo: Repository<ProjectApplication>,
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
  ) {}

  async findAll() {
    return this.applicationsRepo.find();
  }

  async create(application: Partial<ProjectApplication>) {
    const newApp = this.applicationsRepo.create(application);
    return this.applicationsRepo.save(newApp);
  }

  async updateStatus(id: number, status: 'approved' | 'rejected') {
    const application = await this.applicationsRepo.findOneBy({ id });
    if (!application) throw new Error('Application not found');

    application.status = status;
    await this.applicationsRepo.save(application);

    // Если проект одобрен, создаем его в основной таблице проектов
    if (status === 'approved') {
      const project = this.projectsRepo.create({
        title: application.title,
        category: application.category,
        complexity: application.complexity,
        description: application.description,
        technologies: application.technologies,
        deadline: application.deadline,
        status: 'active',
      });
      await this.projectsRepo.save(project);
    }

    return application;
  }
}