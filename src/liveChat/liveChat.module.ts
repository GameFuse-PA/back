import { Module } from '@nestjs/common';
import { LiveChatGateWay } from './liveChatGateWay';
import { LiveChatService } from './liveChat.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConversationsController } from '../conversations/conversations.controller';
import { ConversationsService } from "../conversations/conversations.service";
import { RoomService } from "../room/room.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        LiveChatGateWay,
        UsersService,
        LiveChatService,
        JwtService,
        ConversationsController,
        ConversationsService,
        RoomService,
    ],
})
export class LiveChatModule {}
