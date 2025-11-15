import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // Verify property exists and user is the owner
    const property = await this.prisma.property.findUnique({
      where: { id: createBookingDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.hostId !== userId) {
      throw new ForbiddenException('You can only create bookings for your own properties');
    }

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        status: 'CONFIRMED',
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, userRole: string) {
    // Hosts see bookings for their properties
    if (userRole === 'HOST') {
      return this.prisma.booking.findMany({
        where: {
          property: {
            hostId: userId,
          },
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              type: true,
            },
          },
          cleaningJobs: {
            select: {
              id: true,
              status: true,
              scheduledDate: true,
              cleaner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          checkInDate: 'desc',
        },
      });
    }

    // Admins see all bookings
    if (userRole === 'ADMIN') {
      return this.prisma.booking.findMany({
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              type: true,
              host: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          cleaningJobs: true,
        },
        orderBy: {
          checkInDate: 'desc',
        },
      });
    }

    return [];
  }

  async findOne(id: string, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        cleaningJobs: {
          include: {
            cleaner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userRole === 'HOST' && booking.property.hostId !== userId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }

  async update(id: string, userId: string, userRole: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only host or admin can update
    if (userRole === 'HOST' && booking.property.hostId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
          },
        },
        cleaningJobs: true,
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only host or admin can delete
    if (userRole === 'HOST' && booking.property.hostId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    // Delete related cleaning jobs first
    await this.prisma.cleaningJob.deleteMany({
      where: { bookingId: id },
    });

    return this.prisma.booking.delete({
      where: { id },
    });
  }

  async getUpcoming(userId: string, userRole: string) {
    const today = new Date();
    
    if (userRole === 'HOST') {
      return this.prisma.booking.findMany({
        where: {
          property: {
            hostId: userId,
          },
          checkInDate: {
            gte: today,
          },
          status: 'CONFIRMED',
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          cleaningJobs: {
            select: {
              id: true,
              status: true,
              scheduledDate: true,
            },
          },
        },
        orderBy: {
          checkInDate: 'asc',
        },
        take: 10,
      });
    }

    return [];
  }
}
