import { Module } from '@nestjs/common';
import { LiveChatGateWay } from './liveChatGateWay';
import { LiveChatService } from './liveChat.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
    imports: [],
    controllers: [],
    providers: [LiveChatGateWay, UsersService, LiveChatService, JwtService],
})
export class LiveChatModule {}
