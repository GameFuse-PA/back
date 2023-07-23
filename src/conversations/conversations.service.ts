import { ForbiddenException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
    Conversation,
    ConversationDocument,
} from '../schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../schemas/messages.schema';
import { MessageForChat } from '../liveChat/Models/MessageForChat';
import {
    GameSessions,
    GameSessionsDocument,
} from '../schemas/game-sessions.schema';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>,
        @InjectModel(GameSessions.name)
        private gameSessionModel: Model<GameSessionsDocument>,
    ) {}

    async getConversations(userId: string): Promise<ConversationDocument[]> {
        return this.conversationModel
            .find({
                users: { $in: [userId] },
                isGameChat: false,
            })
            .populate({
                path: 'users',
                select: 'username',
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
                    populate: {
                        path: 'avatar',
                    },
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

    async getConversationById(conversationId: string) {
        return this.conversationModel.findById(conversationId);
    }

    async updateConversation(
        message: MessageDocument,
        senderId: string,
        recipientId: string,
    ) {
        let conversation = null;
        conversation = await this.conversationModel.findOne({
            users: {
                $all: [senderId, recipientId],
                $size: 2,
            },
        });

        if (conversation) {
            if (!conversation.messages.includes(message._id)) {
                conversation.messages.push(message._id);
                return conversation.save();
            } else {
                return;
            }
        } else {
            return null;
        }
    }

    async updateGameSessionChat(
        message: MessageDocument,
        senderId: string,
        conversationId: string,
    ) {
        const gameSession = await this.gameSessionModel.findOne({
            conversation: conversationId,
        });
        const gameSessionConversation = await this.conversationModel.findById(
            gameSession.conversation._id,
        );
        gameSessionConversation.messages.push(message._id);
        return gameSessionConversation.save();
    }

    async saveMessage(
        message: MessageForChat,
        senderId: string,
    ): Promise<MessageDocument> {
        const newMessage = new this.messageModel({
            from: senderId,
            content: message.content,
            date: new Date(),
        });
        return newMessage.save();
    }

    async publishMessage(
        message: MessageForChat,
        senderId: string,
    ): Promise<MessageDocument> {
        return await this.saveMessage(message, senderId);
    }
}
