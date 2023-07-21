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
import { AuthGuard } from '../guards/auth.guard';

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @UseGuards(AuthGuard)
    @HttpCode(201)
    addFriend(@Request() req, @Body() id) {
        return this.friendsService.addFriend(req.userId, id);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteFriend(@Request() req, @Param('id') id: string) {
        const deletedFriend = await this.friendsService.deleteFriend(
            req.userId,
            id,
        );
        return {
            message: `${deletedFriend.username} a été supprimé de vos amis`,
        };
    }
}
