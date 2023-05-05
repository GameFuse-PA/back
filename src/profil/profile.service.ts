import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { S3ConfigService } from '../amazon/s3.config.service';
import { ProfilDto } from './dto/profil.dto';

@Injectable()
export class ProfilService {
    constructor(
        private usersServices: UsersService,
        private s3Services: S3ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async getProfil(id: string) {
        const user = await this.usersServices.findOneById(id);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        user.password = undefined;
        return user;
    }

    async updateProfil(id: string, user: ProfilDto) {
        const userExist = await this.usersServices.findOneById(id);
        if (!userExist) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        const userEmailExist = await this.usersServices.findOneByEmail(
            user.email,
        );
        if (userEmailExist && userEmailExist._id.toString() != id) {
            throw new UnauthorizedException(
                'Un utilisateur avec cet email existe déjà',
            );
        }
        return this.usersServices.updateOneById(id, user);
    }

    async uploadPhoto(userId: any, file: Express.Multer.File) {
        const user = await this.usersServices.findOneById(userId);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        try {
            const saveAvatar = await this.s3Services.uploadFile(
                file.buffer,
                file.originalname,
            );
            user.avatar.location = saveAvatar.ETag;
            user.avatar.key = saveAvatar.ChecksumSHA256;
            await user.save();
            return {
                message: 'Image de profil mise à jour avec succès',
            };
        } catch (e) {
            throw new InternalServerErrorException(e.toString());
        }
    }
}
