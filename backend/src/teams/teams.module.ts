import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../orm/team.entity';
import { User } from '../orm/user.entity';
import { Project } from '../orm/project.entity';
import { Portfolio } from '../orm/portfolio.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, User, Project, Portfolio]),
    AuthModule,
    UsersModule,
    ProjectsModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService], // Экспортируем, если сервис будет использоваться в других модулях
})
export class TeamsModule {}