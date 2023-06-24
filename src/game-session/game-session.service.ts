import { Injectable } from '@nestjs/common';
import {
    GameSessions,
    GameSessionsDocument,
} from '../schemas/game-sessions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
            .populate('members')
            .populate('game')
            .populate('winner')
            .exec();
    }
}
