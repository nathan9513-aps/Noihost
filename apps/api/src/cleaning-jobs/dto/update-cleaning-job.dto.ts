import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { CreateCleaningJobDto } from './create-cleaning-job.dto';

export class UpdateCleaningJobDto extends PartialType(CreateCleaningJobDto) {
  @IsEnum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @IsUUID()
  @IsOptional()
  cleanerId?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;
}
