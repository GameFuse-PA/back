import {
    Controller,
    UseGuards,
    Request,
    Put,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Get,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ProfilService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilDto } from './dto/profil.dto';
import { PasswordDto } from './dto/password.dto';
import { FriendsService } from '../friends/friends.service';
import { GamesService } from '../games/games.service';
import { GameSessionService } from '../game-session/game-session.service';

@Controller('me')
export class ProfilController {
    constructor(
        private profileService: ProfilService,
        private friendsService: FriendsService,
        private gamesService: GamesService,
        private gameSessionService: GameSessionService,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async getProfile(@Request() req) {
        return this.profileService.getProfil(req.userId);
    }

    @UseGuards(AuthGuard)
    @Get('friends')
    getFriends(@Request() req) {
        return this.profileService.getFriends(req.userId);
    }

    @UseGuards(AuthGuard)
    @Get('games')
    getGames(@Request() req) {
        return this.gamesService.getUserGames(req.userId);
    }

    @UseGuards(AuthGuard)
    @Get('game-sessions')
    getGameSessions(@Request() req) {
        return this.gameSessionService.getMyGameSessions(req.userId);
    }

    @UseGuards(AuthGuard)
    @Put()
    async updateProfile(@Request() req, @Body() body: ProfilDto) {
        return this.profileService.updateProfil(req.userId, body);
    }

    @UseGuards(AuthGuard)
    @Put('password')
    async updatePassword(@Request() req, @Body() body: PasswordDto) {
        return this.profileService.updatePassword(req.userId, body);
    }

    @Post('photo')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadPhoto(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.profileService.uploadPhoto(req.userId, file);
    }
}
