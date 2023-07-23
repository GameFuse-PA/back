import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ScoreboardService } from './scoreboard.service';
import { SearchScoreboardDto } from './dto/search-scoreboard.dto';
import { AuthGuard } from '../guards/auth.guard';

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

    @UseGuards(AuthGuard)
    @Get('friends')
    getFriendsScoreboard(@Query() query: SearchScoreboardDto, @Request() req) {
        return this.scoreboardService.getScoreboard(
            query.gameId ? query.gameId : null,
            query.userSearch ? query.userSearch : null,
            req.userId,
        );
    }
}
