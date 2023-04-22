import { Injectable } from '@nestjs/common';
import { FriendsDto } from './Friends.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friends } from '../schemas/friends.schema';
import { Model } from 'mongoose';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friends.name)
        private readonly friendsModel: Model<Friends>,
    ) {}

    getFriends(idUser: string) {
        return this.friendsModel.find({ idUser: idUser });
    }

    async addFriend(friend: FriendsDto) {
        if (!friend) {
            throw new Error('Friend not found');
        }

        return this.friendsModel.create(friend);
    }

    async deleteFriend(idUser: string, id: string) {
        const deleted = await this.friendsModel.deleteOne({
            $and: [{ idUser: idUser }, { idFriend: id }],
        });

        return deleted.deletedCount === 1;
    }
}
