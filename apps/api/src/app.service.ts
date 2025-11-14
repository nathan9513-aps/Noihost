import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Turno Clone API - Cleaning Management Platform';
  }
}
