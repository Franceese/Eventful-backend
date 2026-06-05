import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register(),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}