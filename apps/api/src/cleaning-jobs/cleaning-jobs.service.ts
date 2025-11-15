import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCleaningJobDto } from './dto/create-cleaning-job.dto';
import { UpdateCleaningJobDto } from './dto/update-cleaning-job.dto';

@Injectable()
export class CleaningJobsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCleaningJobDto: CreateCleaningJobDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: createCleaningJobDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not own this property');
    }

    if (createCleaningJobDto.bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: createCleaningJobDto.bookingId },
      });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
    }

    return this.prisma.cleaningJob.create({
      data: {
        propertyId: createCleaningJobDto.propertyId,
        bookingId: createCleaningJobDto.bookingId,
        scheduledDate: new Date(createCleaningJobDto.scheduledDate),
        scheduledTime: createCleaningJobDto.scheduledTime,
        duration: createCleaningJobDto.duration,
        price: createCleaningJobDto.price,
        notes: createCleaningJobDto.notes,
        photos: '',
        problemPhotos: '',
      },
      include: {
        property: true,
        booking: true,
      },
    });
  }

  async findAll(userId: string, userRole: string) {
    if (userRole === 'Host') {
      return this.prisma.cleaningJob.findMany({
        where: {
          property: {
            ownerId: userId,
          },
        },
        include: {
          property: true,
          booking: true,
          cleaner: true,
        },
        orderBy: {
          scheduledDate: 'desc',
        },
      });
    }

    if (userRole === 'Cleaner') {
      return this.prisma.cleaningJob.findMany({
        where: {
          OR: [
            { cleanerId: userId },
            { cleanerId: null },
          ],
        },
        include: {
          property: true,
          booking: true,
        },
        orderBy: {
          scheduledDate: 'desc',
        },
      });
    }

    return this.prisma.cleaningJob.findMany({
      include: {
        property: true,
        booking: true,
        cleaner: true,
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const cleaningJob = await this.prisma.cleaningJob.findUnique({
      where: { id },
      include: {
        property: true,
        booking: true,
        cleaner: true,
      },
    });

    if (!cleaningJob) {
      throw new NotFoundException('Cleaning job not found');
    }

    const property = await this.prisma.property.findUnique({
      where: { id: cleaningJob.propertyId },
    });

    if (userRole === 'Host' && property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === 'Cleaner' && cleaningJob.cleanerId !== userId && cleaningJob.cleanerId !== null) {
      throw new ForbiddenException('Access denied');
    }

    return cleaningJob;
  }

  async update(id: string, userId: string, userRole: string, updateCleaningJobDto: UpdateCleaningJobDto) {
    await this.findOne(id, userId, userRole);

    const updateData: any = {};

    if (updateCleaningJobDto.scheduledDate) {
      updateData.scheduledDate = new Date(updateCleaningJobDto.scheduledDate);
    }
    if (updateCleaningJobDto.scheduledTime) updateData.scheduledTime = updateCleaningJobDto.scheduledTime;
    if (updateCleaningJobDto.duration) updateData.duration = updateCleaningJobDto.duration;
    if (updateCleaningJobDto.status) updateData.status = updateCleaningJobDto.status;
    if (updateCleaningJobDto.cleanerId !== undefined) updateData.cleanerId = updateCleaningJobDto.cleanerId;
    if (updateCleaningJobDto.photos !== undefined) updateData.photos = updateCleaningJobDto.photos;
    if (updateCleaningJobDto.problemPhotos !== undefined) updateData.problemPhotos = updateCleaningJobDto.problemPhotos;
    if (updateCleaningJobDto.problemDescription !== undefined) updateData.problemDescription = updateCleaningJobDto.problemDescription;
    if (updateCleaningJobDto.notes !== undefined) updateData.notes = updateCleaningJobDto.notes;

    if (userRole === 'Cleaner') {
      if (updateCleaningJobDto.cleanerId && updateCleaningJobDto.cleanerId !== userId) {
        throw new ForbiddenException('Cleaners can only assign jobs to themselves');
      }
      if (updateCleaningJobDto.price) {
        throw new ForbiddenException('Cleaners cannot update price');
      }
      if (updateCleaningJobDto.propertyId) {
        throw new ForbiddenException('Cleaners cannot update propertyId');
      }
      if (updateCleaningJobDto.bookingId) {
        throw new ForbiddenException('Cleaners cannot update bookingId');
      }
    } else {
      if (updateCleaningJobDto.price) updateData.price = updateCleaningJobDto.price;
      if (updateCleaningJobDto.propertyId) updateData.propertyId = updateCleaningJobDto.propertyId;
      if (updateCleaningJobDto.bookingId !== undefined) updateData.bookingId = updateCleaningJobDto.bookingId;
    }

    return this.prisma.cleaningJob.update({
      where: { id },
      data: updateData,
      include: {
        property: true,
        booking: true,
        cleaner: true,
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    await this.findOne(id, userId, userRole);

    if (userRole === 'Cleaner') {
      throw new ForbiddenException('Cleaners cannot delete cleaning jobs');
    }

    return this.prisma.cleaningJob.delete({
      where: { id },
    });
  }
}
