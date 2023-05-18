import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
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
            .findOne({ idUser: idUser })
            .populate('idFriends')
            .exec();
    }

    async addFriend(id: string, friend: FriendsDto) {
        if (!friend.idFriends) {
            throw new Error("Erreur avec l'ami entré");
        }
        const userFriend = await this.friendsModel.findOne({ idUser: id });
        if (userFriend && userFriend.idFriends.length >= 0) {
            userFriend.idFriends.push(
                friend.idFriends as unknown as Types.ObjectId,
            );
            return userFriend.save();
        }
        const model: FriendsDto = {
            idFriends: friend.idFriends,
            idUser: id,
        };
        const newFriend = new this.friendsModel(model);
        return newFriend.save();
    }

    async deleteFriend(idUser: string, idFriend: string) {
        const user = await this.friendsModel.findOne({ idUser: idUser });
        if (user && user.idFriends) {
            const newArrayUser = [];
            for (const userElement of user.idFriends) {
                if (userElement.toString() === idFriend) {
                    continue;
                }
                newArrayUser.push(userElement);
            }
            user.idFriends = newArrayUser;
            await user.save();
            return {
                message: 'Ami supprimé',
            };
        }
        throw new InternalServerErrorException(
            "Erreur lors de la suppression de l'ami",
        );
    }
}
