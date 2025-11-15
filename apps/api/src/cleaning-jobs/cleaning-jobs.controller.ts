import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CleaningJobsService } from './cleaning-jobs.service';
import { CreateCleaningJobDto } from './dto/create-cleaning-job.dto';
import { UpdateCleaningJobDto } from './dto/update-cleaning-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('cleaning-jobs')
@UseGuards(JwtAuthGuard)
export class CleaningJobsController {
  constructor(private readonly cleaningJobsService: CleaningJobsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createCleaningJobDto: CreateCleaningJobDto) {
    return this.cleaningJobsService.create(user.id, createCleaningJobDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.cleaningJobsService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cleaningJobsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateCleaningJobDto: UpdateCleaningJobDto,
  ) {
    return this.cleaningJobsService.update(id, user.id, user.role, updateCleaningJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cleaningJobsService.remove(id, user.id, user.role);
  }
}
