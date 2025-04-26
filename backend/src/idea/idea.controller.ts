import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { Idea } from '../orm/idea.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../orm/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Ideas')
@Controller('ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createIdeaDto: CreateIdeaDto,
    @Request() req,
  ): Promise<Idea> {
    return this.ideaService.create(createIdeaDto, req.user);
  }

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('stack') stack: string,
  ): Promise<Idea[]> {
    return this.ideaService.findAll({ search, status, stack });
  }
}