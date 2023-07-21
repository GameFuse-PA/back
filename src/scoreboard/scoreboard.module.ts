import { Module } from '@nestjs/common';
import { ScoreboardController } from './scoreboard.controller';
import { ScoreboardService } from './scoreboard.service';

@Module({
  controllers: [ScoreboardController],
  providers: [ScoreboardService]
})
export class ScoreboardModule {}
