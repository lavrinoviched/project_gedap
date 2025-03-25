import { 
    Controller, 
    Post, 
    Body, 
    Param, 
    Patch,
    UsePipes,
    ValidationPipe 
  } from '@nestjs/common';
  import { ApplicationService } from './application.service';
  import { CreateApplicationDto } from '../dto/create-application.dto';
  
  @Controller('applications')
  export class ApplicationController {
      constructor(private readonly applicationService: ApplicationService) {}
  
      @Post()
      @UsePipes(new ValidationPipe({ 
        whitelist: true,         // Удаляет поля, не описанные в DTO
        forbidNonWhitelisted: true, // Возвращает ошибку при лишних полях
        transform: true          // Автоматическое преобразование типов
      }))
      async create(@Body() applicationData: CreateApplicationDto) {
          return this.applicationService.create(applicationData);
      }
      
      @Patch(':id/approve')
      async approve(@Param('id') id: string) {
          return this.applicationService.approveApplication(+id);
      }
  }