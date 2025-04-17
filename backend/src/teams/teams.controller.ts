import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { TeamsService } from './teams.service';
  import { CreateTeamDto } from './dto/create-team.dto';
  import { UpdateTeamDto } from './dto/update-team.dto';
  import { FilterTeamDto } from './dto/filter-team.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { Role, StatusTeam } from '../common/types';
  
  @Controller('teams')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}
  
    // Создать новую команду (доступно авторизованным пользователям)
    @Post()
    @Roles(Role.user, Role.admin) // Пример: доступно пользователям и админам
    create(@Body() createTeamDto: CreateTeamDto) {
      return this.teamsService.create(createTeamDto);
    }
  
    // Получить список всех команд с возможностью фильтрации
    @Get()
    findAll(@Query() filter: FilterTeamDto) {
      return this.teamsService.findAll(filter);
    }
  
    // Получить данные конкретной команды по ID
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.teamsService.findOne(+id);
    }
  
    // Обновить данные команды (только для лидера команды или админа)
    @Patch(':id')
    @Roles(Role.admin) // Пример: только админ или кастомная проверка на лидера
    update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
      return this.teamsService.update(+id, updateTeamDto);
    }
  
    // Удалить команду (только для админа или владельца)
    @Delete(':id')
    @Roles(Role.admin) // Или кастомная проверка
    remove(@Param('id') id: string) {
      return this.teamsService.remove(+id);
    }
  
    // Дополнительные методы (примеры):
  
    // Изменить статус команды
    @Patch(':id/status')
    updateStatus(
      @Param('id') id: string,
      @Body('status') status: StatusTeam, // Импортировать из src/common/types
    ) {
      return this.teamsService.updateStatus(+id, status);
    }
  
    // Получить проекты команды
    @Get(':id/projects')
    getTeamProjects(@Param('id') id: string) {
      return this.teamsService.getTeamProjects(+id);
    }
  }