import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FileService } from '../amazon/file.service';
import { ProfilDto } from './dto/profil.dto';
import { PasswordDto } from './dto/password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfilService {
    constructor(
        private usersServices: UsersService,
        private fileServices: FileService,
    ) {}

    async getProfil(id: string) {
        const user = await this.usersServices.findOneById(id);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        user.password = undefined;
        return user.populate('avatar');
    }

    async updateProfil(id: string, profil: ProfilDto) {
        const user = await this.usersServices.findOneById(id);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        const userEmailExist = await this.usersServices.findOneByEmail(
            profil.email,
        );
        if (userEmailExist && userEmailExist._id.toString() != id) {
            throw new UnauthorizedException(
                'Un utilisateur avec cet email existe déjà',
            );
        }

        if (profil.email !== undefined) {
            user.email = profil.email;
        }

        if (profil.username !== undefined) {
            user.username = profil.username;
        }

        if (profil.firstname !== undefined) {
            user.firstname = profil.firstname;
        }

        if (profil.lastname !== undefined) {
            user.lastname = profil.lastname;
        }

        const updatedUser = await user.save();
        updatedUser.password = undefined;
        await updatedUser.populate('avatar');
        return {
            message: 'Profil mis à jour avec succès',
            user: updatedUser,
        };
    }

    async getFriends(id: string) {
        const user = await this.usersServices.findOneById(id);
        if (!user) {
            throw new NotFoundException("L'utilisateur n'existe pas");
        }
        const friends = await user.populate({
            path: 'friends',
            select: '-friends',
            populate: {
                path: 'avatar',
            },
        });
        return {
            friends: friends.friends,
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
            const avatar = await this.fileServices.uploadFile(
                file.buffer,
                `${user.id}-${file.originalname}`,
                `profil-pic`,
                file.mimetype,
            );

            user.avatar = avatar;
            await user.save();

            return {
                pic: avatar.location,
                message: 'Image de profil mise à jour avec succès',
            };
        } catch (e) {
            throw new InternalServerErrorException(e.toString());
        }
    }
}
