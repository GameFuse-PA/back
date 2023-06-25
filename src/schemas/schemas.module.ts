import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { File, FileSchema } from './file.schema';
import { Friends, FriendsSchema } from './friends.schema';
import { Game, GameSchema } from './game.schema';
import { Room, RoomSchema } from './room.schema';
import { GameSessions, GameSessionsSchema } from './game-sessions.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        MongooseModule.forFeature([
            { name: Friends.name, schema: FriendsSchema },
        ]),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        MongooseModule.forFeature([
            { name: GameSessions.name, schema: GameSessionsSchema },
        ]),
    ],
    exports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        MongooseModule.forFeature([
            { name: Friends.name, schema: FriendsSchema },
        ]),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        MongooseModule.forFeature([
            { name: GameSessions.name, schema: GameSessionsSchema },
        ]),
    ],
})
export class SchemasModule {}
