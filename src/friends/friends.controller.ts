import { FriendsService } from './friends.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Post,
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
    @Get('getFriends')
    getFriends(@Request() req) {
        return this.friendsService.getFriends(req.userId);
    }

    @HttpCode(201)
    @Post('addFriend')
    addFriend(@Body() friend: FriendsDto): Promise<any> {
        return this.friendsService.addFriend(friend);
    }

    @UseGuards(AuthGuard)
    @Delete('deleteFriend')
    deleteFriend(@Request() req): Promise<boolean> {
        return this.friendsService.deleteFriend(req.userId, req.body.id);
    }
}
