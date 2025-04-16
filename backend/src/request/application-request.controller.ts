import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApplicationRequestService } from './application-request.service';
import { CreateApplicationRequestDto } from '../request/dto/create-application-request.dto';

@Controller('application-requests')
export class ApplicationRequestController {
  constructor(private readonly applicationRequestService: ApplicationRequestService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads/requests',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createDto: CreateApplicationRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const filePaths = files?.map(file => file.path);
    return this.applicationRequestService.create({ ...createDto, files: filePaths });
  }
}