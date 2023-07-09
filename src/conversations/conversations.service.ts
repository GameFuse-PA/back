import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
    Conversation,
    ConversationDocument,
} from '../schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
    ) {}

    async getConversations(userId: string): Promise<ConversationDocument[]> {
        return this.conversationModel
            .find({
                users: { $in: [userId] },
            })
            .populate({
                path: 'users',
                select: 'firstname lastname',
                populate: {
                    path: 'avatar',
                },
            })
            .exec();
    }
}
