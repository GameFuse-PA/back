import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/configuration/app.config.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private appConfigService: AppConfigService
    ) { }

    async signIn(username: string, password: string) {
        const user = await this.usersService.findOneByUsername(username);

        if (user && user.password === password) {
            const payload = { username: user.username, sub: user.userId };

            return {
                access_token: this.jwtService.sign(payload),
                token_type: 'Bearer',
                expires_in: this.appConfigService.jwtExpiration         }
        }

        throw new UnauthorizedException();
    }
}
