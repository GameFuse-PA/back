import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendsDto } from './Friends.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FriendDocument, Friends } from '../schemas/friends.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friends.name) private friendsModel: Model<FriendDocument>,
        private usersServices: UsersService,
    ) {}

    async getFriends(idUser: string) {
        const user = await this.usersServices.findOneByid(idUser);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        return this.friendsModel.find({ idUser: idUser });
    }

    async addFriend(friend: FriendsDto) {
        if (!friend) {
            throw new Error("Erreur avec l'ami entré");
        }
        const newFriend = new this.friendsModel(friend);
        return newFriend.save();
    }

    async deleteFriend(idUser: string, id: string) {
        const deleted = await this.friendsModel.deleteOne({
            $and: [{ idUser: idUser }, { idFriend: id }],
        });

        return deleted.deletedCount === 1;
    }
}
