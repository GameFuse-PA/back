import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../schemas/room.schema';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    ) {}

    async joinRoom(userId: string) {
        const newRoom = new this.roomModel({
            idUsers: userId,
        });
        return await newRoom.save();
    }
}
