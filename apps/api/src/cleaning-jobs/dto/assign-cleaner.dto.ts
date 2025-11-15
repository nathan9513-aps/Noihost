import { IsUUID } from 'class-validator';

export class AssignCleanerDto {
  @IsUUID()
  cleanerId: string;
}
