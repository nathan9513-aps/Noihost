import { IsString, IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  propertyId: string;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsString()
  guestName: string;

  @IsNumber()
  @Min(1)
  guestCount: number;

  @IsNumber()
  @Min(0)
  cleaningFee: number;

  @IsEnum(['AIRBNB', 'VRBO', 'BOOKING_COM', 'DIRECT', 'OTHER'])
  source: string;

  @IsString()
  @IsOptional()
  externalId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
