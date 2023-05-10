import { Module } from '@nestjs/common';
import { LiveChatController } from './liveChat.controller';
import { LiveChatService } from './liveChat.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
    imports: [],
    controllers: [],
    providers: [LiveChatController, UsersService, LiveChatService, JwtService],
})
export class LiveChatModule {}
