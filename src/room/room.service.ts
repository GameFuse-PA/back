import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../schemas/room.schema';
import {
    Conversation,
    ConversationDocument,
} from '../schemas/conversation.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
    ) {}

    async createRoom(userId: string) {
        const conversation = new this.conversationModel({
            users: [userId],
            isGameChat: true,
        });

        const savedConverstion = await conversation.save();

        const newRoom = new this.roomModel({
            idUsers: userId,
            conversation: savedConverstion._id,
        });
        return await newRoom.save();
    }

    async getRoom(roomId: string) {
        const room = await this.roomModel
            .findById(roomId)
            .populate({
                path: 'conversation',
                populate: {
                    path: 'messages',
                    populate: {
                        path: 'from',
                    },
                },
            })
            .exec();
        return room;
    }

    public async addUserToRoom(roomId: string, userId: string) {
        const room = await this.roomModel.findById(roomId);
        const user = await this.userModel.findById(userId);
        if (!room.idUsers.includes(user._id)) {
            room.idUsers.push(user._id);
        }
        room.save();
    }
}
