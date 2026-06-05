import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class ReminderScheduler {
  constructor(
    private readonly remindersService: RemindersService,
    private readonly emailService: EmailService,
  ) {}

  @Cron('*/10 * * * * *')
  async handleCron() {
    const reminders =
      await this.remindersService.processReminders();

    console.log(
      `Found ${reminders.length} reminders`,
    );

    for (const reminder of reminders) {
  await this.emailService.sendReminderEmail(
    reminder.email,
    reminder.message,
    reminder.eventDate,
  );

  console.log(
    `Email sent to ${reminder.email}`,
  );
}
  }
}