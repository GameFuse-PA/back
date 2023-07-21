import { Controller, Get, Query } from '@nestjs/common';
import { ScoreboardService } from './scoreboard.service';
import { SearchScoreboardDto } from './dto/search-scoreboard.dto';

@Controller('scoreboards')
export class ScoreboardController {
    constructor(private scoreboardService: ScoreboardService) {}
    @Get()
    getScoreboard(@Query() query: SearchScoreboardDto) {
        return this.scoreboardService.getScoreboard(
            query.gameId ? query.gameId : null,
            query.userSearch ? query.userSearch : null,
        );
    }
}
