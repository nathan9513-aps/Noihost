import { IsString, IsOptional, IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateCleaningJobDto {
  @IsString()
  propertyId: string;

  @IsString()
  @IsOptional()
  bookingId?: string;

  @IsDateString()
  scheduledDate: string;

  @IsString()
  scheduledTime: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
