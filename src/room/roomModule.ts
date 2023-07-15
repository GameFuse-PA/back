import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { JwtModule } from '@nestjs/jwt';
import { ConversationsService } from "../conversations/conversations.service";

@Module({
    imports: [JwtModule],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService],
})
export class RoomModule {}
