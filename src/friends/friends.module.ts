import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Friends, FriendsSchema } from '../schemas/friends.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([
            { name: Friends.name, schema: FriendsSchema },
        ]),
    ],
    controllers: [FriendsController],
    providers: [FriendsService],
})
export class FriendsModule {}
