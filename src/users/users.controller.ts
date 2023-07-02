import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
    Request,
    Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto/SearchUserDto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    @Get()
    @UseGuards(AuthGuard)
    async searchUser(@Request() req, @Query() searchUser: SearchUserDto) {
        return this.userService.searchUser(searchUser.search, req.userId);
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.findOneById(id);
    }

    @Get()
    async getAllUsers() {
        return this.userService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post(':id/invite')
    async sendInvitation(@Request() req, @Param('id') user: string) {
        const invitation = await this.userService.sendInvitation(
            req.userId,
            user,
        );

        return {
            message: 'Invitation envoyée',
            invitation: invitation,
        };
    }
}
