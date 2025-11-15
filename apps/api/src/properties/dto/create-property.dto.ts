import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  CONDO = 'CONDO',
  VILLA = 'VILLA',
  STUDIO = 'STUDIO',
  OTHER = 'OTHER',
}

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  type: PropertyType;

  @IsNumber()
  @Min(1)
  bedrooms: number;

  @IsNumber()
  @Min(1)
  bathrooms: number;

  @IsNumber()
  @Min(1)
  squareFeet: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  accessInstructions?: string;
}
