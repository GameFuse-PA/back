import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppConfigService } from 'src/configuration/app.config.service';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { NotificationsConfigService } from '../configuration/notifications.config.service';
import { NewPasswordDto } from './dto/newPassword.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private appConfigService: AppConfigService,
        private notificationsService: NotificationsConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async signIn(loginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(
            loginDto.email,
            true,
        );

        if (user && (await bcrypt.compare(loginDto.password, user.password))) {
            const payload = { username: user.username, sub: user._id };
            user.password = undefined;

            return {
                user,
                access_token: this.jwtService.sign(payload),
                token_type: 'Bearer',
                expires_in: this.appConfigService.jwtExpiration,
            };
        }

        throw new UnauthorizedException('Identifiants incorrects');
    }

    async signUp(registerDto: RegisterDto) {
        const existEmail = await this.usersService.findOneByEmail(
            registerDto.email,
        );
        if (existEmail) {
            throw new ConflictException(
                'Un utilisateur avec cet email existe déjà',
            );
        }

        const existUsername = await this.usersService.findOneByUsername(
            registerDto.username,
        );
        if (existUsername) {
            throw new ConflictException(
                'Un utilisateur avec ce pseudo existe déjà',
            );
        }

        const salt = await bcrypt.genSalt();
        registerDto.password = await bcrypt.hash(registerDto.password, salt);
        const newUser = new this.userModel(registerDto);
        const user = await newUser.save();

        const payload = { username: user.username, sub: user._id };
        user.password = undefined;

        return {
            user,
            access_token: this.jwtService.sign(payload),
            token_type: 'Bearer',
            expires_in: this.appConfigService.jwtExpiration,
        };
    }

    async sendResetPasswordEmail(resetPasswordDto: ResetPasswordDto) {
        const user = await this.usersService.findOneByEmail(
            resetPasswordDto.email,
        );
        if (!user) {
            throw new UnauthorizedException('Identifiants incorrects');
        }
        const payload = { email: user.email, sub: user._id };

        const subject = 'Réinitialisation de votre email';
        const token = this.jwtService.sign(payload);
        const text = `<h1>Bonjour</h1>
         <p>Vous avez demandé récemment un changement de mot de passe voici le lien vous permettant de le réinitialiser</p>
         <a href="http://localhost:4200/newPassword?token=${token}">http://localhost:4200/newPassword?token=${token}</a>`;

        user.newPasswordToken = token;
        await user.save();
        return await this.notificationsService.sendEmail(
            resetPasswordDto.email,
            subject,
            text,
        );
    }

    async resetPassword(userId: string, newPasswordDto: NewPasswordDto) {
        const user = await this.usersService.findOneById(userId);
        if (!user || !user.newPasswordToken) {
            throw new UnauthorizedException(
                "Le token a expiré ou vous n'êtes plus autorisé à accéder à cette partie",
            );
        }
        const salt = await bcrypt.genSalt();
        let password = newPasswordDto.password;
        password = await bcrypt.hash(password, salt);
        user.password = password;
        user.newPasswordToken = undefined;
        await user.save();
        return {
            message:
                "Mot de passe bien modifié, vous pouvez l'utilisez pour votre prochaine connexion",
        };
    }
}
