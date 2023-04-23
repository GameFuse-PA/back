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

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private appConfigService: AppConfigService,
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

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.usersService.findOneByEmail(resetPasswordDto.email);
        if (!user) {
            throw new UnauthorizedException('Identifiants incorrects');
        }
        const salt = await bcrypt.genSalt();
        let password = resetPasswordDto.password;
        password = await bcrypt.hash(password, salt);
        user.password = password;
        await user.save();
        return user;
    }
}
