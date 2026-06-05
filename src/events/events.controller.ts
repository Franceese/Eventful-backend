import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CREATOR')
  createEvent(
    @Req() req: any,
    @Body() body: CreateEventDto,
  ) {
    return this.eventsService.createEvent(
      req.user,
      body,
    );
  }

  @Get()
getAllEvents(@Req() req: any) {
  return this.eventsService.findAll(
    req.query,
  );
}

  @Get('mine')
  @UseGuards(JwtGuard)
  getMyEvents(@Req() req: any) {
    return this.eventsService.findMine(
      req.user,
    );
  }

  @Get('analytics')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CREATOR')
  getAnalytics(@Req() req: any) {
    return this.eventsService.getAnalytics(
      req.user,
    );
  }

  @Get(':eventId/analytics')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CREATOR')
  getEventAnalytics(
    @Param('eventId') eventId: string,
  ) {
    return this.eventsService.getEventAnalytics(
      eventId,
    );
  }

  @Get(':eventId/share')
  getShareLinks(
    @Param('eventId') eventId: string,
  ) {
    return this.eventsService.getShareLinks(
      eventId,
    );
  }
}