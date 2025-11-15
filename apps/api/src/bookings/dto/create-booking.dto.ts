import { IsString, IsEmail, IsOptional, IsInt, Min, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  propertyId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsString()
  guestName: string;

  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @IsOptional()
  guestPhone?: string;

  @IsInt()
  @Min(1)
  numberOfGuests: number;

  @IsString()
  platform: string;

  @IsString()
  @IsOptional()
  platformBookingId?: string;
}
