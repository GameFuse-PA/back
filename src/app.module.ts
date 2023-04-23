import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { FriendsModule } from './friends/friends.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasModule } from './schemas/schemas.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigurationModule,
    SchemasModule,
    DatabaseModule,
        FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
