import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { FriendsDto } from './dto/Friends.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FriendDocument, Friends } from '../schemas/friends.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import {
    Conversation,
    ConversationDocument,
} from '../schemas/conversation.schema';
import {
    Invitations,
    InvitationsDocument,
} from '../schemas/invitations.schema';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friends.name) private friendsModel: Model<FriendDocument>,
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
        @InjectModel(Invitations.name)
        private invitationModel: Model<InvitationsDocument>,
        private usersServices: UsersService,
    ) {}

    async addFriend(id: string, friend: FriendsDto) {
        if (!friend.idFriends) {
            throw new Error("Erreur avec l'ami entré");
        }
        const user = await this.usersServices.findOneById(id);
        const userFriend = await this.usersServices.findOneById(
            friend.idFriends,
        );

        if (!user || !userFriend) {
            throw new Error("Erreur avec l'ami entré");
        }
        if (user._id.toString() === userFriend._id.toString()) {
            throw new ConflictException(
                'Vous essayez de vous ajouter en ami, je peux être le votre si vous le souhaitez 🙂',
            );
        }

        if (
            user.friends.includes(userFriend._id) ||
            userFriend.friends.includes(user._id)
        ) {
            throw new Error('Vous êtes déjà ami avec cette personne');
        }

        user.friends.push(userFriend._id);
        userFriend.friends.push(user._id);
        await user.save();
        await userFriend.save();

        await this.invitationModel
            .deleteOne({
                $or: [
                    {
                        $and: [
                            {
                                sender: userFriend._id,
                            },
                            {
                                receiver: user._id,
                            },
                        ],
                    },
                    {
                        $and: [
                            {
                                sender: user._id,
                            },
                            {
                                receiver: userFriend._id,
                            },
                        ],
                    },
                ],
            })
            .exec();

        const conversation = new this.conversationModel({
            users: [user._id, userFriend._id],
        });
        await conversation.save();

        return {
            message: 'Ami ajouté',
        };
    }
    async refuseFriend(userId: string, friend: FriendsDto) {
        if (!friend.idFriends) {
            throw new Error("Erreur avec l'ami entré");
        }
        const user = await this.usersServices.findOneById(userId);
        const userFriend = await this.usersServices.findOneById(
            friend.idFriends,
        );

        if (!user || !userFriend) {
            throw new Error("Erreur avec l'ami entré");
        }
        if (user._id.toString() === userFriend._id.toString()) {
            throw new ConflictException('Vous ne pouvez pas vous refuser');
        }

        if (
            user.friends.includes(userFriend._id) ||
            userFriend.friends.includes(user._id)
        ) {
            throw new Error('Vous êtes déjà ami avec cette personne');
        }
        await this.invitationModel
            .deleteOne({
                $or: [
                    {
                        $and: [
                            {
                                sender: userFriend._id,
                            },
                            {
                                receiver: user._id,
                            },
                        ],
                    },
                    {
                        $and: [
                            {
                                sender: user._id,
                            },
                            {
                                receiver: userFriend._id,
                            },
                        ],
                    },
                ],
            })
            .exec();

        return {
            message: 'Invitation refusée',
        };
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
