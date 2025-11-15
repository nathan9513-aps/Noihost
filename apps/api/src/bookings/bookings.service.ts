import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: createBookingDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not own this property');
    }

    return this.prisma.booking.create({
      data: {
        propertyId: createBookingDto.propertyId,
        guestName: createBookingDto.guestName,
        guestEmail: createBookingDto.guestEmail,
        guestPhone: createBookingDto.guestPhone,
        checkIn: new Date(createBookingDto.checkIn),
        checkOut: new Date(createBookingDto.checkOut),
        numberOfGuests: createBookingDto.numberOfGuests,
        platform: createBookingDto.platform,
        platformBookingId: createBookingDto.platformBookingId,
      },
      include: {
        property: true,
      },
    });
  }

  async findAll(userId: string, userRole: string) {
    if (userRole === 'Host') {
      return this.prisma.booking.findMany({
        where: {
          property: {
            ownerId: userId,
          },
        },
        include: {
          property: true,
          cleaningJobs: true,
        },
        orderBy: {
          checkIn: 'desc',
        },
      });
    }

    if (userRole === 'Cleaner') {
      return this.prisma.booking.findMany({
        where: {
          cleaningJobs: {
            some: {
              cleanerId: userId,
            },
          },
        },
        include: {
          property: true,
          cleaningJobs: {
            where: {
              cleanerId: userId,
            },
          },
        },
        orderBy: {
          checkIn: 'desc',
        },
      });
    }

    return this.prisma.booking.findMany({
      include: {
        property: true,
        cleaningJobs: true,
      },
      orderBy: {
        checkIn: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: true,
        cleaningJobs: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (userRole === 'Host' && booking.property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === 'Cleaner') {
      const hasAssignedJob = booking.cleaningJobs.some(
        job => job.cleanerId === userId
      );
      if (!hasAssignedJob) {
        throw new ForbiddenException('Access denied');
      }
    }

    return booking;
  }

  async update(id: string, userId: string, userRole: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id, userId, userRole);

    if (userRole === 'Cleaner') {
      throw new ForbiddenException('Cleaners cannot update bookings');
    }

    const updateData: any = {};
    
    if (updateBookingDto.guestName) updateData.guestName = updateBookingDto.guestName;
    if (updateBookingDto.guestEmail !== undefined) updateData.guestEmail = updateBookingDto.guestEmail;
    if (updateBookingDto.guestPhone !== undefined) updateData.guestPhone = updateBookingDto.guestPhone;
    if (updateBookingDto.numberOfGuests) updateData.numberOfGuests = updateBookingDto.numberOfGuests;
    if (updateBookingDto.platform) updateData.platform = updateBookingDto.platform;
    if (updateBookingDto.platformBookingId !== undefined) updateData.platformBookingId = updateBookingDto.platformBookingId;
    if (updateBookingDto.status) updateData.status = updateBookingDto.status;
    if (updateBookingDto.checkIn) updateData.checkIn = new Date(updateBookingDto.checkIn);
    if (updateBookingDto.checkOut) updateData.checkOut = new Date(updateBookingDto.checkOut);

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        property: true,
        cleaningJobs: true,
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    await this.findOne(id, userId, userRole);

    if (userRole === 'Cleaner') {
      throw new ForbiddenException('Cleaners cannot delete bookings');
    }

    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
