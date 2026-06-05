import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendReminderEmail(
    email: string,
    eventTitle: string,
    eventDate: Date,
  ) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${eventTitle}`,
      html: `
        <h2>Event Reminder</h2>
        <p>Your event <strong>${eventTitle}</strong> is coming up.</p>
        <p>Date: ${eventDate}</p>
      `,
    });
  }
}