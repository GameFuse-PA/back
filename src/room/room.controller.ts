import {
    Controller,
    UseGuards,
    Request,
    Get,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService,
    ) {}

    @UseGuards(AuthGuard)
    @Get('roomCreation')
    getFriends(@Request() req) {
        console.log("coucou in back")
        //ID generation + save
        return "couou"
    }
}
