import { FriendsService } from './friends.service';
import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
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

    @UseGuards(AuthGuard)
    @HttpCode(201)
    addFriend(@Request() req, @Body() id) {
        return this.friendsService.addFriend(req.userId, id);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteFriend(@Request() req, @Param() id): Promise<boolean> {
        return this.friendsService.deleteFriend(req.userId, id);
    }
}
