import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { File, FileSchema } from './file.schema';
import { Friends, FriendsSchema } from './friends.schema';
import { Game, GameSchema } from './game.schema';
import { GameSessions, GameSessionsSchema } from './game-sessions.schema';
import { Invitations, InvitationsSchema } from './invitations.schema';
import { Conversation, ConversationSchema } from './conversation.schema';
import { Message, MessageSchema } from './messages.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        MongooseModule.forFeature([
            { name: Friends.name, schema: FriendsSchema },
        ]),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([
            { name: GameSessions.name, schema: GameSessionsSchema },
        ]),
        MongooseModule.forFeature([
            { name: Invitations.name, schema: InvitationsSchema },
        ]),
        MongooseModule.forFeature([
            { name: Conversation.name, schema: ConversationSchema },
        ]),
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    exports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        MongooseModule.forFeature([
            { name: Friends.name, schema: FriendsSchema },
        ]),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([
            { name: GameSessions.name, schema: GameSessionsSchema },
        ]),
        MongooseModule.forFeature([
            { name: Invitations.name, schema: InvitationsSchema },
        ]),
        MongooseModule.forFeature([
            { name: Conversation.name, schema: ConversationSchema },
        ]),
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
})
export class SchemasModule {}
