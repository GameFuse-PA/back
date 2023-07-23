import { Injectable } from '@nestjs/common';
import {
    Invitations,
    InvitationsDocument,
} from '../schemas/invitations.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvitationsService {
    constructor(
        @InjectModel(Invitations.name)
        private invitationModel: Model<InvitationsDocument>,
    ) {}

    async findMyInvitations(id: string) {
        return this.invitationModel
            .find({
                $or: [{ sender: id }, { receiver: id }],
            })
            .populate({
                path: 'sender',
                select: '-friends',
                populate: { path: 'avatar' },
            })
            .populate({
                path: 'receiver',
                select: '-friends -_id',
                populate: { path: 'avatar' },
            })
            .exec();
    }

    async findInvitationById(id: string) {
        return this.invitationModel.findById(id).exec();
    }
}
