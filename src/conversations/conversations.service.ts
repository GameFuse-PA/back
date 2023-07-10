import { ForbiddenException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
    Conversation,
    ConversationDocument,
} from '../schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../schemas/messages.schema';
import { MessageForChat } from '../liveChat/Models/MessageForChat';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>,
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

    async getConversation(userId: string, conversationId: string) {
        const conversation = await this.conversationModel
            .findById(conversationId)
            .populate({
                path: 'users',
                populate: {
                    path: 'avatar',
                },
            })
            .exec();
        for (const user of conversation.users) {
            if (user._id.toString() === userId) {
                return conversation;
            }
        }
        throw new ForbiddenException(
            'User not allowed to send message to this conversation',
        );
    }

    async updateConversation(message: MessageDocument, conversationId: string) {
        const conversation = await this.conversationModel.findById(
            conversationId,
        );
        conversation.messages.push(message._id);
        return conversation.save();
    }

    async saveMessage(message: MessageForChat) {
        const newMessage = new this.messageModel({
            from: message.from._id,
            text: message.content,
        });
        return newMessage.save();
    }
}
