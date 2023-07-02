import {
    Body,
    Controller,
    HttpCode,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { FriendsService } from '../friends/friends.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('invitations')
export class InvitationsController {
    constructor(private friendsService: FriendsService) {}

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Post('accept')
    acceptInvitationFriend(@Request() req, @Body() id) {
        return this.friendsService.addFriend(req.userId, id);
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Post('refuse')
    rejectInvitationFriend(@Request() req, @Body() id) {
        return this.friendsService.refuseFriend(req.userId, id);
    }
}
