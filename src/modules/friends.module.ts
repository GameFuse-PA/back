import { Module } from '@nestjs/common';
import { FriendsController } from '../controllers/friends.controller';
import { FriendsService } from '../services/friends.service';

@Module({
    imports: [],
    controllers: [FriendsController],
    providers: [FriendsService],
})
export class FriendsModule {}
