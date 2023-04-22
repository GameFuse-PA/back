import { FriendsService } from './friends.service';
import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { FriendsDto } from './Friends.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        private jwtService: JwtService,
    ) {}

    @HttpCode(200)
    @Get('getFriends')
    getFriends(@Request() req) {
        return this.friendsService.getFriends(req.user.userId);
    }

    @HttpCode(201)
    @Post('addFriend')
    addFriend(@Body() friend: FriendsDto): Promise<any> {
        return this.friendsService.addFriend(friend);
    }
}
