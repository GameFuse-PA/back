import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../schemas/room.schema';
import {
    Conversation,
    ConversationDocument,
} from '../schemas/conversation.schema';
import { GameSessionDto } from '../game-session/dto/game-session.dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
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
        console.log(
            'on save ' +
                savedConverstion +
                ' dans une nouvelle room : ' +
                newRoom +
                ' puis un return',
        );
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
                    }
                },
            })
            .exec();
        console.log(room);
        return room;
    }
}
