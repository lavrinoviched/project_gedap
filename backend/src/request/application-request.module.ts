import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationRequest } from '../orm/application-request.entity';
import { ApplicationRequestController } from './application-request.controller';
import { ApplicationRequestService } from './application-request.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationRequest]),
    MulterModule.register({
      dest: './uploads/requests',
    }),
  ],
  controllers: [ApplicationRequestController],
  providers: [ApplicationRequestService],
})
export class ApplicationRequestModule {}