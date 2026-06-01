import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(user: any, body: any) {
    if (user.role !== 'CREATOR') {
      throw new Error('Only creators can create events');
    }

    return this.prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        venue: body.venue,
        eventDate: new Date(body.eventDate),
        ticketPrice: body.ticketPrice,
        creatorId: user.userId,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMine(user: any) {
    return this.prisma.event.findMany({
      where: {
        creatorId: user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAnalytics(user: any) {
    const events = await this.prisma.event.findMany({
      where: {
        creatorId: user.userId,
      },
      include: {
        tickets: true,
      },
    });

    const totalEvents = events.length;

    const totalTicketsSold = events.reduce(
      (sum, event) => sum + event.tickets.length,
      0,
    );

    const totalAttendees = events.reduce(
      (sum, event) =>
        sum +
        event.tickets.filter(
          (ticket) => ticket.isScanned,
        ).length,
      0,
    );

    return {
      totalEvents,
      totalTicketsSold,
      totalAttendees,
    };
  }

  async getEventAnalytics(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        tickets: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const ticketsSold = event.tickets.length;

    const attendeesScanned =
      event.tickets.filter(
        (ticket) => ticket.isScanned,
      ).length;

    const revenue =
      ticketsSold * event.ticketPrice;

    return {
      event: event.title,
      ticketsSold,
      attendeesScanned,
      revenue,
    };
  }
}