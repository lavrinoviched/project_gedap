import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../orm/application.entity';
import { AdminApplicationController } from './admin-applications.controller';
import { AdminApplicationService } from './admin-applications.service';
import { MailerService } from '../application/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  controllers: [AdminApplicationController],
  providers: [AdminApplicationService, MailerService],
})
export class AdminModule {}