import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @UseGuards(AuthGuard)
    @Post()
    getFriends(@Request() req) {
        return this.roomService.createRoom(req.userId);
    }
}
