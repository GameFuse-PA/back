import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { File, FileDocument } from '../schemas/file.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileService } from '../amazon/file.service';
import { ProfilDto } from './dto/profil.dto';
import { AppConfigService } from '../configuration/app.config.service';
import { PasswordDto } from './dto/password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfilService {
    constructor(
        private usersServices: UsersService,
        private fileServices: FileService,
        private appConfig: AppConfigService,
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
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

        const updatedUser = await this.usersServices.updateOneById(id, user);
        updatedUser.password = undefined;
        return {
            message: 'Profil mis à jour avec succès',
            user: updatedUser,
        };
    }

    async updatePassword(id: string, user: PasswordDto) {
        const userExist = await this.usersServices.findOneById(id);
        if (!userExist) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        const salt = await bcrypt.genSalt();
        let password = user.password;
        password = await bcrypt.hash(password, salt);
        userExist.password = password;
        await userExist.save();
        return {
            message:
                "Mot de passe bien modifié, vous pouvez l'utiliser pour votre prochaine connexion",
        };
    }

    async uploadPhoto(userId: any, file: Express.Multer.File) {
        const user = await this.usersServices.findOneById(userId);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        try {
            const saveAvatar = await this.fileServices.uploadFile(
                file.buffer,
                `profil-pic/${user.id}-${file.originalname}`,
            );

            const urlPic = `https://${this.appConfig.awsBucketName}.s3.${this.appConfig.awsRegion}.amazonaws.com/profil-pic/${user.id}-${file.originalname}`;
            const newFileModel = new this.fileModel({
                location: urlPic,
                key: saveAvatar.ETag,
                name: `${user.username.toLowerCase()}-${
                    file.originalname.split('.')[0]
                }`,
                type: file.originalname.split('.')[1].toUpperCase(),
            });

            user.avatar = await newFileModel.save();

            await user.save();

            return {
                pic: urlPic,
                message: 'Image de profil mise à jour avec succès',
            };
        } catch (e) {
            throw new InternalServerErrorException(e.toString());
        }
    }
}
