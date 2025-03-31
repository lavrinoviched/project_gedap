import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'initiator', required: false })
  @ApiQuery({ name: 'techStack', required: false })
  @ApiQuery({ name: 'ideaStatus', required: false })
  @ApiQuery({ name: 'teamSizeFrom', required: false })
  @ApiQuery({ name: 'teamSizeTo', required: false })
  @ApiQuery({ name: 'rewardFrom', required: false })
  @ApiQuery({ name: 'rewardTo', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'difficulty', required: false })
  @ApiQuery({ name: 'deadlineFrom', required: false })
  @ApiQuery({ name: 'deadlineTo', required: false })
  @ApiQuery({ name: 'rewardType', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Filtered projects list' })
  async findAll(@Query() filterDto: ProjectFilterDto) {
    return this.projectsService.findAllWithFilters(filterDto);
  }
}