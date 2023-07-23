import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { SchemasModule } from './schemas/schemas.module';
import { DatabaseModule } from './database/database.module';
import { ProfilModule } from './profil/profil.module';
import { FileModule } from './amazon/file.module';
import { MailModule } from './mail/mail.module';
import { LiveChatModule } from './liveChat/liveChat.module';
import { JwtModule } from '@nestjs/jwt';
import { GamesModule } from './games/games.module';
import { FriendsModule } from './friends/friends.module';
import { GameSessionModule } from './game-session/game-session.module';
import { ConversationsModule } from './conversations/conversations.module';
import { InvitationsModule } from './invitations/invitations.module';
import { RunnerModule } from './runner/runner.module';
import { SocketModule } from './socket/socket.module';
import { CommonModule } from './common/common.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ConfigurationModule,
        SchemasModule,
        DatabaseModule,
        ProfilModule,
        FileModule,
        MailModule,
        LiveChatModule,
        JwtModule,
        FriendsModule,
        GamesModule,
        GameSessionModule,
        ConversationsModule,
        InvitationsModule,
        RunnerModule,
        SocketModule,
        CommonModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
