import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UsersModule, JwtModule],
    controllers: [FriendsController],
    providers: [FriendsService],
})
export class FriendsModule {}