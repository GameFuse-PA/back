import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ProfilDto } from '../profil/dto/profil.dto';
import {
    Invitations,
    InvitationsDocument,
} from '../schemas/invitations.schema';
import { NotificationsConfigService } from '../configuration/notifications.config.service';
import { MailConfigService } from '../configuration/mail.config.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Invitations.name)
        private invitationModel: Model<InvitationsDocument>,
        private notificationsService: NotificationsConfigService,
        private mailerService: MailConfigService,
    ) {}

    async findOneByEmail(
        email: string,
        withPassword = false,
    ): Promise<UserDocument> {
        return this.userModel
            .findOne({ email })
            .select(withPassword ? '+password' : '')
            .populate('avatar')
            .exec();
    }

    async findOneByUsername(username: string): Promise<UserDocument> {
        return this.userModel.findOne({ username }).exec();
    }

    async findOneById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id).exec();
    }
    async updateOneById(id: string, user: ProfilDto) {
        return this.userModel.findByIdAndUpdate(id, user).exec();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    async searchUser(value: string, userId: string): Promise<UserDocument[]> {
        const response = [];

        const usersSearch = await this.userModel
            .find({
                $or: [
                    {
                        $and: [
                            { username: { $regex: value, $options: 'i' } },
                            { _id: { $ne: userId } },
                        ],
                    },
                    {
                        $and: [
                            { firstname: { $regex: value, $options: 'i' } },
                            { _id: { $ne: userId } },
                        ],
                    },
                    {
                        $and: [
                            { email: { $regex: value, $options: 'i' } },
                            { _id: { $ne: userId } },
                        ],
                    },
                ],
            })
            .populate('avatar')
            .populate('friends')
            .exec();

        for (const user of usersSearch) {
            if (user.friends.find((e) => e._id.toString() === userId)) {
                response.push({ user: user, isFriend: true });
            } else {
                response.push({ user: user, isFriend: false });
            }
        }
        return response;
    }

    async sendInvitation(userId: string, idFriend: string) {
        const userFriend = await this.userModel.findById(idFriend);
        const senderUser = await this.userModel.findById(userId);

        if (!userFriend || !senderUser) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }

        if (userFriend._id.toString() === senderUser._id.toString()) {
            throw new ConflictException(
                "Vous ne pouvez pas vous ajouter vous même, c'est assez triste en y pensant",
            );
        }

        if (userFriend.friends.includes(senderUser._id.toString())) {
            throw new ConflictException(
                "Une erreur s'est produite lors de l'invitation",
            );
        }

        if (senderUser.friends.includes(userFriend._id.toString())) {
            throw new ConflictException(
                "Une erreur s'est produite lors de l'invitation",
            );
        }

        const invitationExist = await this.invitationModel.findOne({
            $or: [
                { $and: [{ sender: userId }, { receiver: idFriend }] },
                { $and: [{ sender: idFriend }, { receiver: userId }] },
            ],
        });
        if (invitationExist) {
            throw new ConflictException('Une invitation a déjà été envoyée');
        }
        const newInvitation = new this.invitationModel({
            sender: userId,
            receiver: idFriend,
        });
        const inviteResponse = await newInvitation.save();

        const mailSendInvit = this.mailerService.getFriendRequestMail(
            senderUser.username,
            inviteResponse._id,
        );

        await this.notificationsService.sendEmail(
            userFriend.email,
            mailSendInvit.subject,
            mailSendInvit.body,
        );

        return inviteResponse;
    }
}
