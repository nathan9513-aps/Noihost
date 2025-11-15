import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, createBookingDto);
  }

  @Get()
  @Roles('HOST', 'ADMIN')
  findAll(@Request() req) {
    return this.bookingsService.findAll(req.user.userId, req.user.role);
  }

  @Get('upcoming')
  @Roles('HOST', 'ADMIN')
  getUpcoming(@Request() req) {
    return this.bookingsService.getUpcoming(req.user.userId, req.user.role);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN')
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @Roles('HOST', 'ADMIN')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(
      id,
      req.user.userId,
      req.user.role,
      updateBookingDto,
    );
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  remove(@Param('id') id: string, @Request() req) {
    return this.bookingsService.remove(id, req.user.userId, req.user.role);
  }
}
