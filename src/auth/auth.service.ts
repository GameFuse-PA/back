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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (user && user.password === loginDto.password) {
      const payload = { username: user.username, sub: user._id };

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
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const existUsername = await this.usersService.findOneByUsername(
      registerDto.username,
    );

    if (existUsername) {
      throw new ConflictException('Un utilisateur avec ce pseudo existe déjà');
    }

    const newUser = new this.userModel(registerDto);

    return newUser.save();
  }
}
