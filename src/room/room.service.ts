import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../schemas/room.schema';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    ) {}

    async createRoom(userId: string) {
        const newUser = new this.roomModel({
            idUsers: userId,
        });
        const user = await newUser.save();
        console.log('user saved in base');
        console.log(user);
        return user;
    }
}
