import { Module } from '@nestjs/common';
import { ProfilController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { ProfilService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../amazon/file.module';
import { FriendsModule } from '../friends/friends.module';
import { GamesModule } from '../games/games.module';
import { GameSessionModule } from '../game-session/game-session.module';
import { InvitationsModule } from '../invitations/invitations.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { LiveChatModule } from '../liveChat/liveChat.module';

@Module({
    imports: [
        UsersModule,
        JwtModule,
        FileModule,
        FriendsModule,
        GamesModule,
        GameSessionModule,
        InvitationsModule,
        ConversationsModule,
        LiveChatModule,
    ],
    controllers: [ProfilController],
    providers: [ProfilService],
})
export class ProfilModule {}
