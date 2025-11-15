import { PartialType } from '@nestjs/mapped-types';
import { CreateCleaningJobDto } from './create-cleaning-job.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCleaningJobDto extends PartialType(CreateCleaningJobDto) {
  @IsEnum(['Pending', 'Assigned', 'Accepted', 'InProgress', 'Completed', 'Cancelled'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  cleanerId?: string;

  @IsString()
  @IsOptional()
  photos?: string;

  @IsString()
  @IsOptional()
  problemPhotos?: string;

  @IsString()
  @IsOptional()
  problemDescription?: string;
}
