import { IsString, IsEmail, IsOptional, IsInt, Min, IsDateString } from 'class-validator';import { IsString, IsEmail, IsOptional, IsInt, Min, IsDateString } from 'class-validator';import { IsString, IsNotEmpty, IsDateString, IsInt, IsOptional, Min } from 'class-validator';



export class CreateBookingDto {

  @IsString()

  propertyId: string;export class CreateBookingDto {export class CreateBookingDto {



  @IsDateString()  @IsString()  @IsString()

  checkIn: string;

  propertyId: string;  @IsNotEmpty()

  @IsDateString()

  checkOut: string;  propertyId: string;



  @IsString()  @IsDateString()

  guestName: string;

  checkIn: string; // ISO 8601 date string  @IsString()

  @IsEmail()

  @IsOptional()  @IsNotEmpty()

  guestEmail?: string;

  @IsDateString()  guestName: string;

  @IsString()

  @IsOptional()  checkOut: string; // ISO 8601 date string

  guestPhone?: string;

  @IsString()

  @IsInt()

  @Min(1)  @IsString()  @IsOptional()

  numberOfGuests: number;

  guestName: string;  guestEmail?: string;

  @IsString()

  platform: string;



  @IsString()  @IsEmail()  @IsString()

  @IsOptional()

  platformBookingId?: string;  @IsOptional()  @IsOptional()

}

  guestEmail?: string;  guestPhone?: string;



  @IsString()  @IsDateString()

  @IsOptional()  @IsNotEmpty()

  guestPhone?: string;  checkIn: string;



  @IsInt()  @IsDateString()

  @Min(1)  @IsNotEmpty()

  numberOfGuests: number;  checkOut: string;



  @IsString()  @IsInt()

  platform: string; // 'Airbnb', 'Vrbo', 'Direct', 'Other'  @Min(1)

  numberOfGuests: number;

  @IsString()

  @IsOptional()  @IsString()

  platformBookingId?: string;  @IsOptional()

}  platform?: string;


  @IsString()
  @IsOptional()
  platformBookingId?: string;
}
