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
        JwtModule,//TODO:  à garder ?
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
