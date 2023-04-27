import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendsDto } from './dto/Friends.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FriendDocument, Friends } from '../schemas/friends.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friends.name) private friendsModel: Model<FriendDocument>,
        private usersServices: UsersService,
    ) {}

    async getFriends(idUser: string) {
        const user = await this.usersServices.findOneById(idUser);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        return this.friendsModel
            .find({ idUser: idUser })
            .populate('idFriend')
            .exec();
    }

    async addFriend(id: string, friend: FriendsDto) {
        if (!friend.idFriend) {
            throw new Error("Erreur avec l'ami entré");
        }
        const userFriend = await this.friendsModel.findById(id);
        if (userFriend && userFriend.idFriend.length > 0) {
            userFriend.idFriend.push(
                friend.idFriend as unknown as Types.ObjectId,
            );
            return userFriend.save();
        }
        const model: FriendsDto = {
            idFriend: friend.idFriend,
            idUser: id,
        };
        const newFriend = new this.friendsModel(model);
        return newFriend.save();
    }

    async deleteFriend(idUser: string, id: string) {
        const deleted = await this.friendsModel.deleteOne({
            $and: [{ idUser: idUser }, { idFriend: id }],
        });

        return deleted.deletedCount === 1;
    }
}
