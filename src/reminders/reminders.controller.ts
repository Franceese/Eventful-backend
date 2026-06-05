import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { RemindersService } from './reminders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateReminderDto } from './dto/create-reminder.dto';

@ApiTags('reminders')
@ApiBearerAuth()
@Controller('reminders')
export class RemindersController {
  constructor(
    private remindersService: RemindersService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  createReminder(
    @Req() req: any,
    @Body() body: CreateReminderDto,
  ) {
    return this.remindersService.createReminder(
      req.user,
      body,
    );
  }

  @Get('my')
  @UseGuards(JwtGuard)
  getMyReminders(@Req() req: any) {
    return this.remindersService.getMyReminders(
      req.user,
    );
  }

  @Get('process')
processReminders() {
  return this.remindersService.processReminders();
}
}