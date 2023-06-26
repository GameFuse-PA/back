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
import { InvitationsDto } from './dto/invitations.dto';
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
        return this.userModel
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
            .exec();
    }

    async sendInvitation(userId: string, user: InvitationsDto) {
        const userFriend = await this.userModel.findById(user.receiver);
        const userExist = await this.userModel.findById(userId);

        if (!userFriend || !userExist) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }

        const invitationExist = await this.invitationModel.findOne({
            $and: [{ sender: userId }, { receiver: user.receiver }],
        });
        if (invitationExist) {
            throw new ConflictException('Une invitation a déjà été envoyée');
        }
        const newInvitation = new this.invitationModel({
            sender: userId,
            receiver: user.receiver,
        });
        const inviteResponse = await newInvitation.save();

        const mailSendInvit = this.mailerService.getInvitationMail(
            userExist.username,
            inviteResponse._id,
        );

        await this.notificationsService.sendEmail(
            userFriend.email,
            mailSendInvit.subject,
            mailSendInvit.body,
        );

        return {
            message: 'Invitation envoyée',
            invitation: inviteResponse,
        };
    }
}
