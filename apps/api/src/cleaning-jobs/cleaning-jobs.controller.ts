import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CleaningJobsService } from './cleaning-jobs.service';
import { CreateCleaningJobDto } from './dto/create-cleaning-job.dto';
import { UpdateCleaningJobDto } from './dto/update-cleaning-job.dto';
import { AssignCleanerDto } from './dto/assign-cleaner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cleaning-jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CleaningJobsController {
  constructor(private readonly cleaningJobsService: CleaningJobsService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  create(@Request() req, @Body() createCleaningJobDto: CreateCleaningJobDto) {
    return this.cleaningJobsService.create(req.user.userId, createCleaningJobDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.cleaningJobsService.findAll(req.user.userId, req.user.role);
  }

  @Get('available')
  @Roles('CLEANER', 'ADMIN')
  findAvailable(@Request() req) {
    return this.cleaningJobsService.findAvailable(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.cleaningJobsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCleaningJobDto: UpdateCleaningJobDto,
  ) {
    return this.cleaningJobsService.update(
      id,
      req.user.userId,
      req.user.role,
      updateCleaningJobDto,
    );
  }

  @Post(':id/assign')
  @Roles('HOST', 'ADMIN')
  assignCleaner(
    @Param('id') id: string,
    @Request() req,
    @Body() assignCleanerDto: AssignCleanerDto,
  ) {
    return this.cleaningJobsService.assignCleaner(
      id,
      req.user.userId,
      req.user.role,
      assignCleanerDto,
    );
  }

  @Post(':id/accept')
  @Roles('CLEANER')
  acceptJob(@Param('id') id: string, @Request() req) {
    return this.cleaningJobsService.acceptJob(id, req.user.userId);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  remove(@Param('id') id: string, @Request() req) {
    return this.cleaningJobsService.remove(id, req.user.userId, req.user.role);
  }
}
