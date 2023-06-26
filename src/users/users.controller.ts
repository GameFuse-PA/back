import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
    Request,
    Post,
    Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto/SearchUserDto';
import { AuthGuard } from '../guards/auth.guard';
import { InvitationsDto } from './dto/invitations.dto';

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
    @Post('invitations')
    async sendInvitation(@Request() req, @Body() user: InvitationsDto) {
        return this.userService.sendInvitation(req.userId, user);
    }
}
