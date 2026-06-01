import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async buyTicket(user: any, eventId: string) {
  if (user.role !== 'EVENTEE') {
    throw new Error('Only eventees can buy tickets');
  }

  const event = await this.prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  const qrPayload = JSON.stringify({
    userId: user.userId,
    eventId,
    timestamp: Date.now(),
  });

  const qrCode = await QRCode.toDataURL(qrPayload);

  const ticket = await this.prisma.ticket.create({
    data: {
      userId: user.userId,
      eventId,
      qrCode,
    },
  });

  return {
    message: 'Ticket purchased successfully',
    ticket,
  };
}

async scanTicket(ticketId: string) {
  const ticket = await this.prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  if (ticket.isScanned) {
    return {
      message: 'Ticket already used',
    };
  }

  const updatedTicket = await this.prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      isScanned: true,
    },
  });

  return {
    message: 'Ticket verified successfully',
    ticket: updatedTicket,
  };
}
}