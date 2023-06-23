import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { AuthGuard } from '../guards/auth.guard';
import { GameSessionDto } from './dto/game-session.dto';

@Controller('parties')
export class GameSessionController {
    constructor(private gameSessionService: GameSessionService) {}

    @UseGuards(AuthGuard)
    @Post()
    createParty(@Request() req, @Body() body: GameSessionDto) {
        return this.gameSessionService.createParty(body);
    }
}
