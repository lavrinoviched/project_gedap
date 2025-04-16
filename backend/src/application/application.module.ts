import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../orm/application.entity';
import { ApplicationService } from '../application/application.service';
import { ApplicationController } from '../application/application.controller';
import { MailerService } from '../application/mailer.service';


@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  controllers: [ApplicationController],
  providers: [ApplicationService, MailerService],
})
export class ApplicationModule {}