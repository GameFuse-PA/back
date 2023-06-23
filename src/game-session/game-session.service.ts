import { Injectable } from '@nestjs/common';
import { Parties, PartiesDocument } from '../schemas/parties.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSessionDto } from './dto/game-session.dto';

@Injectable()
export class GameSessionService {
    constructor(
        @InjectModel(Parties.name)
        private readonly gameSessionModel: Model<PartiesDocument>,
    ) {}

    async getMyParties(id: string) {
        return await this.gameSessionModel
            .find({ $or: [{ createdBy: id }, { members: id }] })
            .populate('createdBy')
            .populate('members')
            .populate('game')
            .populate('winner')
            .exec();
    }

    async createParty(party: GameSessionDto) {
        const newParty = new this.gameSessionModel(party);
        return await newParty.save();
    }
}
