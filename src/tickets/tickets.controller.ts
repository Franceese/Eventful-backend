import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post('buy/:eventId')
  @UseGuards(JwtGuard)
  buyTicket(
    @Req() req: any,
    @Param('eventId') eventId: string,
  ) {
    return this.ticketsService.buyTicket(
      req.user,
      eventId,
    );
  }

  @Post('scan/:ticketId')
scanTicket(
  @Param('ticketId') ticketId: string,
) {
  return this.ticketsService.scanTicket(ticketId);
}
}