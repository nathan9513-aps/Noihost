import { Module } from '@nestjs/common';
import { CleaningJobsService } from './cleaning-jobs.service';
import { CleaningJobsController } from './cleaning-jobs.controller';

@Module({
  providers: [CleaningJobsService],
  controllers: [CleaningJobsController]
})
export class CleaningJobsModule {}
