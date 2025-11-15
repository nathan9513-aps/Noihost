import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsEnum(['CONFIRMED', 'CANCELLED', 'COMPLETED'])
  @IsOptional()
  status?: string;
}
