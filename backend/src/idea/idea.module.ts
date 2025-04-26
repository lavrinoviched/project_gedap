import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from '../orm/idea.entity';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { User } from '../orm/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User])],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}