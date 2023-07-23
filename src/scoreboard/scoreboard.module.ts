import { Module } from '@nestjs/common';
import { ScoreboardController } from './scoreboard.controller';
import { ScoreboardService } from './scoreboard.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    controllers: [ScoreboardController],
    providers: [ScoreboardService],
})
export class ScoreboardModule {}
