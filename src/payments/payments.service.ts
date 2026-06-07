import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as QRCode from 'qrcode';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initializePayment(
    user: any,
    eventId: string,
  ) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: event.ticketPrice * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const payment = await this.prisma.payment.create({
      data: {
        amount: event.ticketPrice,
        status: 'PENDING',
        reference: response.data.data.reference,
        userId: user.userId,
        eventId,
      },
    });

    return {
      message: 'Payment initialized',
      payment,
      authorizationUrl:
        response.data.data.authorization_url,
    };
  }

  async verifyPayment(reference: string) {
  const payment = await this.prisma.payment.findUnique({
    where: {
      reference,
    },
    include: {
      event: true,
    },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const paystackStatus = response.data.data.status;

  if (paystackStatus !== 'success') {
    return {
      message: 'Payment not completed',
      status: paystackStatus,
    };
  }

  // Always update payment status once Paystack confirms success
  if (payment.status !== 'SUCCESS') {
    await this.prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: 'SUCCESS',
      },
    });
  }

  const existingTicket = await this.prisma.ticket.findFirst({
    where: {
      userId: payment.userId,
      eventId: payment.eventId,
    },
  });

  const ticketsSold = await this.prisma.ticket.count({
    where: {
      eventId: payment.eventId,
    },
  });

  if (ticketsSold >= payment.event.capacity && !existingTicket) {
    throw new Error('Event is sold out');
  }

  // Prevent duplicate ticket creation
  if (existingTicket) {
    return {
      message: 'Payment already verified',
      alreadyProcessed: true,
      ticket: existingTicket,
    };
  }

  const qrCode = await QRCode.toDataURL(
    `${payment.userId}:${payment.eventId}:${reference}`,
  );

  const ticket = await this.prisma.ticket.create({
    data: {
      userId: payment.userId,
      eventId: payment.eventId,
      qrCode,
    },
  });

  return {
    message: 'Payment verified successfully',
    ticket,
  };
}

  async getCreatorPayments(user: any) {
  const payments = await this.prisma.payment.findMany({
    where: {
      event: {
        creatorId: user.userId,
      },
    },
    include: {
      event: true,
    },
  });

  const totalRevenue = payments
    .filter((payment) => payment.status === 'SUCCESS')
    .reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

  const successfulPayments = payments.filter(
    (payment) => payment.status === 'SUCCESS',
  ).length;

  return {
    totalRevenue,
    totalPayments: payments.length,
    successfulPayments,
    payments,
  };
}
}