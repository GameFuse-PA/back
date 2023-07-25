import { Module } from '@nestjs/common';
import { LiveChatGateWay } from './liveChatGateWay';
import { LiveChatService } from './liveChat.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import { GameSessionService } from '../game-session/game-session.service';

@Module({
    imports: [],
    controllers: [],
    providers: [
        LiveChatGateWay,
        UsersService,
        LiveChatService,
        JwtService,
        ConversationsService,
        GameSessionService,
    ],
    exports: [LiveChatService],
})
export class LiveChatModule {}
