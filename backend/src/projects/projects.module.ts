import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]), // Регистрация сущности Project для TypeORM
  ],
  controllers: [ProjectsController], // Подключение контроллера
  providers: [ProjectsService], // Подключение сервиса
  exports: [ProjectsService], // Экспорт сервиса, если он будет использоваться в других модулях (например, в TeamsModule)
})
export class ProjectsModule {}