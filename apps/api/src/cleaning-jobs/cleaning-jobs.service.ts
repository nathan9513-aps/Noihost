import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCleaningJobDto } from './dto/create-cleaning-job.dto';
import { UpdateCleaningJobDto } from './dto/update-cleaning-job.dto';
import { AssignCleanerDto } from './dto/assign-cleaner.dto';

@Injectable()
export class CleaningJobsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCleaningJobDto: CreateCleaningJobDto) {
    // Verify property exists and user is the owner
    const property = await this.prisma.property.findUnique({
      where: { id: createCleaningJobDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.hostId !== userId) {
      throw new ForbiddenException('You can only create jobs for your own properties');
    }

    // If bookingId provided, verify it belongs to the property
    if (createCleaningJobDto.bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: createCleaningJobDto.bookingId },
      });

      if (!booking || booking.propertyId !== createCleaningJobDto.propertyId) {
        throw new BadRequestException('Invalid booking for this property');
      }
    }

    return this.prisma.cleaningJob.create({
      data: {
        ...createCleaningJobDto,
        status: 'PENDING',
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
        booking: {
          select: {
            id: true,
            guestName: true,
            checkInDate: true,
            checkOutDate: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, userRole: string) {
    // Hosts see jobs for their properties
    if (userRole === 'HOST') {
      return this.prisma.cleaningJob.findMany({
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
          booking: {
            select: {
              id: true,
              guestName: true,
              checkInDate: true,
              checkOutDate: true,
            },
          },
          cleaner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              rating: true,
            },
          },
        },
        orderBy: {
          scheduledDate: 'desc',
        },
      });
    }

    // Cleaners see their assigned jobs
    if (userRole === 'CLEANER') {
      return this.prisma.cleaningJob.findMany({
        where: {
          cleanerId: userId,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              type: true,
              bedrooms: true,
              bathrooms: true,
              host: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
          booking: {
            select: {
              id: true,
              guestName: true,
              checkInDate: true,
              checkOutDate: true,
            },
          },
        },
        orderBy: {
          scheduledDate: 'asc',
        },
      });
    }

    // Admins see all jobs
    if (userRole === 'ADMIN') {
      return this.prisma.cleaningJob.findMany({
        include: {
          property: {
            include: {
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
          booking: true,
          cleaner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          scheduledDate: 'desc',
        },
      });
    }

    return [];
  }

  async findAvailable(userId: string) {
    // Cleaners can see available jobs (PENDING status)
    return this.prisma.cleaningJob.findMany({
      where: {
        status: 'PENDING',
        cleanerId: null,
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            type: true,
            bedrooms: true,
            bathrooms: true,
            squareFeet: true,
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                rating: true,
              },
            },
          },
        },
        booking: {
          select: {
            id: true,
            guestName: true,
            checkInDate: true,
            checkOutDate: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const job = await this.prisma.cleaningJob.findUnique({
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
                rating: true,
              },
            },
          },
        },
        booking: true,
        cleaner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            rating: true,
          },
        },
        checklistItems: true,
        photos: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Cleaning job not found');
    }

    // Check permissions
    if (userRole === 'HOST' && job.property.hostId !== userId) {
      throw new ForbiddenException('You can only view jobs for your own properties');
    }

    if (userRole === 'CLEANER' && job.cleanerId !== userId) {
      throw new ForbiddenException('You can only view your own jobs');
    }

    return job;
  }

  async update(id: string, userId: string, userRole: string, updateCleaningJobDto: UpdateCleaningJobDto) {
    const job = await this.prisma.cleaningJob.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!job) {
      throw new NotFoundException('Cleaning job not found');
    }

    // Check permissions
    if (userRole === 'HOST' && job.property.hostId !== userId) {
      throw new ForbiddenException('You can only update jobs for your own properties');
    }

    if (userRole === 'CLEANER' && job.cleanerId !== userId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    return this.prisma.cleaningJob.update({
      where: { id },
      data: updateCleaningJobDto,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        booking: true,
        cleaner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async assignCleaner(id: string, userId: string, userRole: string, assignCleanerDto: AssignCleanerDto) {
    const job = await this.prisma.cleaningJob.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!job) {
      throw new NotFoundException('Cleaning job not found');
    }

    // Only host or admin can assign
    if (userRole === 'HOST' && job.property.hostId !== userId) {
      throw new ForbiddenException('You can only assign cleaners to your own properties');
    }

    // Verify cleaner exists and has CLEANER role
    const cleaner = await this.prisma.user.findUnique({
      where: { id: assignCleanerDto.cleanerId },
    });

    if (!cleaner || cleaner.role !== 'CLEANER') {
      throw new BadRequestException('Invalid cleaner');
    }

    return this.prisma.cleaningJob.update({
      where: { id },
      data: {
        cleanerId: assignCleanerDto.cleanerId,
        status: 'ASSIGNED',
      },
      include: {
        property: true,
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
    });
  }

  async acceptJob(id: string, userId: string) {
    const job = await this.prisma.cleaningJob.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Cleaning job not found');
    }

    if (job.status !== 'PENDING') {
      throw new BadRequestException('Job is no longer available');
    }

    if (job.cleanerId && job.cleanerId !== userId) {
      throw new BadRequestException('Job is already assigned');
    }

    return this.prisma.cleaningJob.update({
      where: { id },
      data: {
        cleanerId: userId,
        status: 'ASSIGNED',
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const job = await this.prisma.cleaningJob.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!job) {
      throw new NotFoundException('Cleaning job not found');
    }

    // Only host or admin can delete
    if (userRole === 'HOST' && job.property.hostId !== userId) {
      throw new ForbiddenException('You can only delete jobs for your own properties');
    }

    // Delete related data first
    await this.prisma.cleaningChecklistItem.deleteMany({
      where: { cleaningJobId: id },
    });

    await this.prisma.cleaningPhoto.deleteMany({
      where: { cleaningJobId: id },
    });

    return this.prisma.cleaningJob.delete({
      where: { id },
    });
  }
}
