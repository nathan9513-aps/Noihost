import { IsUUID, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCleaningJobDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  @IsOptional()
  bookingId?: string;

  @IsDateString()
  scheduledDate: string;

  @IsEnum(['STANDARD', 'DEEP', 'TURNOVER', 'CHECKOUT'])
  cleaningType: string;

  @IsNumber()
  @Min(0)
  estimatedDuration: number; // in minutes

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  specialInstructions?: string;
}
