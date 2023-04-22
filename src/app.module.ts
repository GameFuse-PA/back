import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { FriendsModule } from './friends/friends.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ConfigurationModule,
        FriendsModule,
        MongooseModule.forRoot('mongodb://localhost:27017/nestjs'),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
