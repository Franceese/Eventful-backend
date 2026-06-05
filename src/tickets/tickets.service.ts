import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async buyTicket(
    user: any,
    eventId: string,
  ) {
    if (user.role !== 'EVENTEE') {
      throw new Error(
        'Only eventees can buy tickets',
      );
    }

    const event =
      await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

    if (!event) {
      throw new Error('Event not found');
    }

    const ticket =
      await this.prisma.ticket.create({
        data: {
          userId: user.userId,
          eventId,
        },
      });

    const qrCode =
      await QRCode.toDataURL(ticket.id);

    const updatedTicket =
      await this.prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          qrCode,
        },
      });

    return {
      message:
        'Ticket purchased successfully',
      ticket: updatedTicket,
    };
  }

  async scanTicket(ticketId: string) {
    const ticket =
      await this.prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });

    if (!ticket) {
      throw new Error(
        'Ticket not found',
      );
    }

    if (ticket.isScanned) {
      return {
        message:
          'Ticket already used',
      };
    }

    const updatedTicket =
      await this.prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          isScanned: true,
        },
      });

    return {
      message:
        'Ticket verified successfully',
      ticket: updatedTicket,
    };
  }
}