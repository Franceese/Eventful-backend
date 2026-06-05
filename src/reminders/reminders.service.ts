import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createReminder(
    user: any,
    body: any,
  ) {
    return this.prisma.reminder.create({
      data: {
        remindAt: new Date(body.remindAt),
        userId: user.userId,
        eventId: body.eventId,
      },
    });
  }

  async getMyReminders(user: any) {
    return this.prisma.reminder.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        event: true,
      },
      orderBy: {
        remindAt: 'asc',
      },
    });
  }

  async processReminders() {
  const reminders =
    await this.prisma.reminder.findMany({
      where: {
        remindAt: {
          lte: new Date(),
        },
        isSent: false,
      },
      include: {
        user: true,
        event: true,
      },
    });

  for (const reminder of reminders) {
    await this.prisma.reminder.update({
      where: {
        id: reminder.id,
      },
      data: {
        isSent: true,
      },
    });
  }

  return reminders.map((reminder) => ({
    id: reminder.id,
    message: `Reminder: ${reminder.event.title} is coming up`,
    email: reminder.user.email,
    eventDate: reminder.event.eventDate,
  }));
}
}