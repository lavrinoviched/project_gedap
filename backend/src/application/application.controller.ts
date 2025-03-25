import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';

@Controller('applications')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

    @Post()
    async create(@Body() applicationData: CreateApplicationDto) {
        return this.applicationService.create(applicationData);
    }

    @Patch(':id/approve')
    async approve(@Param('id') id: string) {
        return this.applicationService.approveApplication(+id);
    }
}