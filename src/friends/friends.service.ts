import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { FriendRequestDto } from './dto/friendRequest.dto';
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

    async addFriend(id: string, friend: FriendRequestDto) {
        const user = await this.usersServices.findOneById(id);
        const userFriend = await this.usersServices.findOneById(
            friend.idFriend,
        );

        if (!user || !userFriend) {
            throw new Error("Erreur avec l'ami entré");
        }
        if (user._id.toString() === userFriend._id.toString()) {
            throw new ConflictException(
                "Vous ne pouvez pas vous ajouter en tant qu'ami, c'est bizarre",
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

        const conversationExist = await this.conversationModel.findOne({
            users: [user._id, userFriend._id],
        });

        if (conversationExist) {
            return conversationExist;
        }

        const conversation = new this.conversationModel({
            users: [user._id, userFriend._id],
        });

        return await conversation.save();
    }
    async refuseFriend(userId: string, friend: FriendRequestDto) {
        if (!friend.idFriend) {
            throw new Error("Erreur avec l'ami entré");
        }
        const user = await this.usersServices.findOneById(userId);
        const userFriend = await this.usersServices.findOneById(
            friend.idFriend,
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
        const user = await this.usersServices.findOneById(idUser);
        const userFriend = await this.usersServices.findOneById(idFriend);

        if (!user || !userFriend) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        const newArrayOfFriends = user.friends.filter((friend) => {
            return friend._id.toString() !== userFriend._id.toString();
        });
        const newArrayOfFriendsFriend = userFriend.friends.filter((friend) => {
            return friend._id.toString() !== user._id.toString();
        });

        user.friends = newArrayOfFriends;
        userFriend.friends = newArrayOfFriendsFriend;

        await userFriend.save();
        return await user.save();
    }
}
