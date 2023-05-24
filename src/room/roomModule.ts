import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { UsersModule } from '../users/users.module';
import { RoomService } from './room.service';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../amazon/file.module';
import { FriendsModule } from '../friends/friends.module';

@Module({
    imports: [UsersModule, JwtModule, FileModule, FriendsModule],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
