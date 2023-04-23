import { FriendsService } from './friends.service';
import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    Request,
    UseGuards,
} from '@nestjs/common';
import { FriendsDto } from './dto/Friends.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../guards/auth.guard';

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        private jwtService: JwtService,
    ) {}

    @UseGuards(AuthGuard)
    getFriends(@Request() req) {
        return this.friendsService.getFriends(req.userId);
    }

    @HttpCode(201)
    addFriend(@Body() friend: FriendsDto) {
        return this.friendsService.addFriend(friend);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteFriend(@Request() req, @Param() id): Promise<boolean> {
        return this.friendsService.deleteFriend(req.userId, id);
    }
}
