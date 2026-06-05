import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { PaymentsModule } from './payments/payments.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000,
      max: 100,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    JwtModule,
    EventsModule,
    TicketsModule,
    PaymentsModule,
    RemindersModule,
  ],
})
export class AppModule {}