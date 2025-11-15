import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  create(
    @CurrentUser() user: any,
    @Body(ValidationPipe) createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(user.userId, createPropertyDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.propertiesService.findAll(user.userId, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.findOne(id, user.userId, user.role);
  }

  @Patch(':id')
  @Roles('HOST', 'ADMIN')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body(ValidationPipe) updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, user.userId, user.role, updatePropertyDto);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.remove(id, user.userId, user.role);
  }
}
