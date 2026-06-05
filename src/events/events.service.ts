import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

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
  category: body.category,
  capacity: body.capacity,
  creatorId: user.userId,
},
    });
  }

  async findAll(query: any) {
  const { search, venue, category } = query;

  // Use cache only when no filters are applied
  if (!search && !venue && !category) {
    const cachedEvents =
      await this.cacheManager.get(
        'all-events',
      );

    if (cachedEvents) {
      return cachedEvents;
    }
  }

  const events =
    await this.prisma.event.findMany({
      where: {
        ...(search && {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        }),

        ...(venue && {
          venue: {
            contains: venue,
            mode: 'insensitive',
          },
        }),

        ...(category && {
  category,
}),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

  if (!search && !venue && !category) {
    await this.cacheManager.set(
      'all-events',
      events,
    );
  }

  return events;
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

  async getShareLinks(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const encodedTitle = encodeURIComponent(
      event.title,
    );

    return {
      event: event.title,
      shareLinks: {
        twitter: `https://twitter.com/intent/tweet?text=Join%20${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/events/${event.id}`,
        whatsapp: `https://wa.me/?text=Join%20${encodedTitle}`,
      },
    };
  }
}