import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [AuthModule, UsersModule, EventsModule, TicketsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}