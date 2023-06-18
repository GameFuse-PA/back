import { Injectable } from '@nestjs/common';
import { Parties, PartiesDocument } from '../schemas/parties.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PartyDto } from './dto/party.dto';

@Injectable()
export class PartiesService {
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

    async createParty(party: PartyDto) {
        const newParty = new this.partyModel(party);
        return await newParty.save();
    }
}
