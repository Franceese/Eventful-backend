import { IsString } from 'class-validator';

export class InitializePaymentDto {
  @IsString()
  eventId: string;
}