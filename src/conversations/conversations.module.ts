import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    controllers: [],
    providers: [ConversationsService],
    exports: [ConversationsService],
})
export class ConversationsModule {}
