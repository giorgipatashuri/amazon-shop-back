import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WakeUpService } from './wake-up.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  providers: [WakeUpService],
})
export class WakeUpModule {}
