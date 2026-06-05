import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReminderScheduler } from './reminder.scheduler';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [NotificationsModule],
  controllers: [RemindersController],
  providers: [
    RemindersService,
    PrismaService,
    ReminderScheduler,
  ],
})
export class RemindersModule {}