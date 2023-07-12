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
            .populate({
                path: 'messages',
                populate: {
                    path: 'from',
                },
            })
            .exec();

        for (const user of conversation.users) {
            if (user._id.toString() === userId) {
                return conversation;
            }
        }

        throw new ForbiddenException(
            'User not allowed to send a message to this conversation',
        );
    }

    async updateConversation(
        message: MessageDocument,
        senderId: string,
        recipientId: string,
    ) {
        const conversation = await this.conversationModel.findOne({
            users: {
                $all: [senderId, recipientId],
                $size: 2,
            },
        });

        if (!conversation.messages.includes(message._id)) {
            conversation.messages.push(message._id);
            return conversation.save();
        } else {
            return;
        }
    }

    async saveMessage(
        message: MessageForChat,
        senderId: string,
    ): Promise<MessageDocument> {
        const newMessage = new this.messageModel({
            from: senderId,
            content: message.content,
        });
        return newMessage.save();
    }

    async publishMessage(
        message: MessageForChat,
        senderId: string,
    ): Promise<MessageDocument> {
        //TODO : verfiier que le userId est bien dans la conv, que le userId existe et que la conv aussi
        const messageToDb = await this.saveMessage(message, senderId);
        await this.updateConversation(messageToDb, senderId, message.to);
        return messageToDb;
    }
}
