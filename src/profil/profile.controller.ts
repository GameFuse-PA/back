import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ProfilService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilDto } from './dto/profil.dto';
import { PasswordDto } from './dto/password.dto';
import { FriendsService } from '../friends/friends.service';
import { GamesService } from '../games/games.service';
import { GameSessionService } from '../game-session/game-session.service';
import { ConversationsService } from '../conversations/conversations.service';
import { MessageForChat } from '../liveChat/Models/MessageForChat';
import { LiveChatService } from '../liveChat/liveChat.service';

@Controller('me')
export class ProfilController {
    constructor(
        private profileService: ProfilService,
        private friendsService: FriendsService,
        private gamesService: GamesService,
        private gameSessionService: GameSessionService,
        private conversationsService: ConversationsService,
        private liveChatService: LiveChatService,
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
    @Get('game-sessions/:id')
    getGameSession(@Request() req, @Param('id') gameSessionId: string) {
        return this.gameSessionService.getGameSession(
            gameSessionId,
            req.userId,
        );
    }

    @UseGuards(AuthGuard)
    @Get('game-sessions')
    getGameSessions(@Request() req) {
        return this.gameSessionService.getMyGameSessions(req.userId);
    }

    @UseGuards(AuthGuard)
    @Get('invitations')
    getInvitations(@Request() req) {
        return this.profileService.getInvitations(req.userId);
    }

    @UseGuards(AuthGuard)
    @Get('invitations/:id')
    getInvitation(@Request() req, @Param('id') id: string) {
        return this.profileService.getInvitation(req.userId, id);
    }

    @UseGuards(AuthGuard)
    @Get('conversations')
    async getConversations(@Request() req) {
        return await this.conversationsService.getConversations(req.userId);
    }

    @UseGuards(AuthGuard)
    @Get('conversations/:id')
    async getConversationById(@Request() req, @Param('id') id: string) {
        return await this.conversationsService.getConversation(req.userId, id);
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

    @UseGuards(AuthGuard)
    @Post('postMessage')
    postMessage(@Request() req, @Body() body: MessageForChat) {
        return this.liveChatService.sendChatToConversation(
            null,
            req.userId,
            body,
        );
    }
}
