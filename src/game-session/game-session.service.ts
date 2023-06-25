import { Injectable } from '@nestjs/common';
import {
    GameSessions,
    GameSessionsDocument,
} from '../schemas/game-sessions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSessionDto } from './dto/game-session.dto';

@Injectable()
export class GameSessionService {
    constructor(
        @InjectModel(GameSessions.name)
        private readonly gameSessionModel: Model<GameSessionsDocument>,
    ) {}

    async getMyGameSessions(id: string) {
        return await this.gameSessionModel
            .find({ $or: [{ createdBy: id }, { members: id }] })
            .populate('createdBy')
            .populate({
                path: 'members',
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

    async createGameSession(party: GameSessionDto) {
        const newParty = new this.gameSessionModel(party);
        return await newParty.save();
    }
}
