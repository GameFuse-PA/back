import {
    Controller,
    UseGuards,
    Request,
    Get,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoomService } from './room.service';
import {v4 as uuidv4} from 'uuid';

@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService,
    ) {}

    @UseGuards(AuthGuard)
    @Get('roomCreation')
    getFriends(@Request() req) {
        let id = uuidv4();
        return id;
    }
}
