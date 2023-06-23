import { Injectable } from '@nestjs/common';
import { Parties, PartiesDocument } from '../schemas/parties.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GameSessionService {
    constructor(
        @InjectModel(Parties.name)
        private readonly partyModel: Model<PartiesDocument>,
    ) {}

    async getMyParties(id: string) {
        return await this.partyModel
            .find({ $or: [{ createdBy: id }, { members: id }] })
            .populate('createdBy')
            .populate('members')
            .populate('game')
            .populate('winner')
            .exec();
    }
}
