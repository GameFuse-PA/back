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
import { AuthGuard } from '../guards/auth.guard';

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @UseGuards(AuthGuard)
    @HttpCode(201)
    @Post('accept')
    addFriend(@Request() req, @Body() id) {
        return this.friendsService.addFriend(req.userId, id);
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Post('refuse')
    refuseFriend(@Request() req, @Body() id) {
        return this.friendsService.refuseFriend(req.userId, id);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteFriend(@Request() req, @Param('id') id: string) {
        return this.friendsService.deleteFriend(req.userId, id);
    }
}
