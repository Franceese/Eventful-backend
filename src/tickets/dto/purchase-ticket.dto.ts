import { IsString } from 'class-validator';

export class PurchaseTicketDto {
  @IsString()
  eventId: string;
}