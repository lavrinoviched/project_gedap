import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/types';
import { AdminApplicationService } from '../admin/admin-applications.service';
import { ApplicationResponseDto } from './dto/application-response.dto';

@Controller('admin/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
export class AdminApplicationController {
  constructor(private readonly applicationService: AdminApplicationService) {}

  @Get()
  async getAllApplications() {
    return this.applicationService.getAllApplications();
  }

  @Get(':id')
  async getApplicationDetails(@Param('id') id: number) {
    return this.applicationService.getApplicationById(id);
  }

  @Post(':id/respond')
  async respondToApplication(
    @Param('id') id: number,
    @Body() responseDto: ApplicationResponseDto,
  ) {
    return this.applicationService.updateApplicationStatus(id, responseDto);
  }
}