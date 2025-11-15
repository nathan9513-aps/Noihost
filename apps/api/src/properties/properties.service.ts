import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPropertyDto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        ...createPropertyDto,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, role?: string) {
    // If HOST, return only their properties
    if (role === 'HOST' && userId) {
      return this.prisma.property.findMany({
        where: { ownerId: userId },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              cleaningJobs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // If ADMIN or CLEANER, return all properties
    return this.prisma.property.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            cleaningJobs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string, role?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        bookings: {
          orderBy: { checkIn: 'desc' },
          take: 10,
        },
        cleaningJobs: {
          orderBy: { scheduledDate: 'desc' },
          take: 10,
          include: {
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
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // HOSTs can only see their own properties
    if (role === 'HOST' && property.ownerId !== userId) {
      throw new ForbiddenException('You can only access your own properties');
    }

    return property;
  }

  async update(id: string, userId: string, role: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Only owner or admin can update
    if (role === 'HOST' && property.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    return this.prisma.property.update({
      where: { id },
      data: updatePropertyDto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Only owner or admin can delete
    if (role === 'HOST' && property.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    return this.prisma.property.delete({
      where: { id },
    });
  }
}
