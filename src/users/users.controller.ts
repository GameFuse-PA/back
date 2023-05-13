import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.findOneById(id);
    }

    @Get()
    async getAllUsers() {
        return this.userService.findAll();
    }
}
