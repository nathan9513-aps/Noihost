import { Module } from '@nestjs/common';
import { CleaningJobsService } from './cleaning-jobs.service';
import { CleaningJobsController } from './cleaning-jobs.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CleaningJobsService],
  controllers: [CleaningJobsController],
  exports: [CleaningJobsService],
})
export class CleaningJobsModule {}
