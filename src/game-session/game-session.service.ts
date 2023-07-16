import { Injectable } from '@nestjs/common';
import {
    GameSessions,
    GameSessionsDocument,
} from '../schemas/game-sessions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSessionDto } from './dto/game-session.dto';
import {
    Conversation,
    ConversationDocument,
} from '../schemas/conversation.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class GameSessionService {
    constructor(
        @InjectModel(GameSessions.name)
        private readonly gameSessionModel: Model<GameSessionsDocument>,
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

    async getGameSession(gameSessionId: string) {
        return await this.gameSessionModel
            .findById(gameSessionId)
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
    }

    async getMyGameSessions(id: string) {
        return await this.gameSessionModel
            .find({ $or: [{ createdBy: id }, { players: id }] })
            .populate('createdBy')
            .populate({
                path: 'players',
                populate: {
                    path: 'avatar',
                },
            })
            .populate({
                path: 'game',
                populate: {
                    path: 'banner',
                },
            })
            .populate({
                path: 'game',
                populate: {
                    path: 'program',
                },
            })
            .populate('winner')
            .exec();
    }

    async createGameSession(userId: string, gameSessionDto: GameSessionDto) {
        const conversation = new this.conversationModel({
            users: [userId],
            isGameChat: true,
        });

        const savedConverstion = await conversation.save();

        const newGameSession = new this.gameSessionModel({
            ...gameSessionDto,
            createdBy: userId,
            conversation: savedConverstion._id,
        });
        return await newGameSession.save();
    }

    public async addUserToGameSession(gameSessionId: string, userId: string) {
        const gameSession = await this.gameSessionModel.findById(gameSessionId);
        const user = await this.userModel.findById(userId);
        if (!gameSession.players.includes(user._id)) {
            gameSession.players.push(user._id);
        }
        gameSession.save();
    }
}
