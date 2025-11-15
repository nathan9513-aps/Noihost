import { PartialType } from '@nestjs/mapped-types';import { PartialType } from '@nestjs/mapped-types';import { PartialType } from '@nestjs/mapped-types';import { PartialType } from '@nestjs/mapped-types';

import { CreateBookingDto } from './create-booking.dto';

import { IsEnum, IsOptional } from 'class-validator';import { CreateBookingDto } from './create-booking.dto';



export class UpdateBookingDto extends PartialType(CreateBookingDto) {import { IsEnum, IsOptional } from 'class-validator';import { CreateBookingDto } from './create-booking.dto';import { IsEnum, IsOptional } from 'class-validator';

  @IsEnum(['Pending', 'Confirmed', 'Cancelled', 'Completed'])

  @IsOptional()

  status?: string;

}export class UpdateBookingDto extends PartialType(CreateBookingDto) {import { IsString, IsOptional } from 'class-validator';import { CreateBookingDto } from './create-booking.dto';


  @IsEnum(['Pending', 'Confirmed', 'Cancelled', 'Completed'])

  @IsOptional()

  status?: string;

}export class UpdateBookingDto extends PartialType(CreateBookingDto) {export class UpdateBookingDto extends PartialType(CreateBookingDto) {


  @IsString()  @IsEnum(['CONFIRMED', 'CANCELLED', 'COMPLETED'])

  @IsOptional()  @IsOptional()

  status?: string;  status?: string;

}}

