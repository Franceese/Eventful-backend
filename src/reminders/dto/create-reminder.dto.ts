import {
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateReminderDto {
  @IsUUID()
  eventId: string;

  @IsDateString()
  remindAt: string;
}