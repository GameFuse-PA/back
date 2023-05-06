import { Module } from '@nestjs/common';
import { LiveChatController } from './liveChat.controller';
import { LiveChatService } from './liveChat.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [],
    controllers: [],
    providers: [LiveChatController, LiveChatService, JwtService],
})
export class LiveChatModule {}
