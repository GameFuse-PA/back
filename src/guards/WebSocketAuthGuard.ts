import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../configuration/app.config.service';
import { Socket } from 'socket.io';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private appConfigService: AppConfigService,
    ) {}

    async canActivate(context: any): Promise<boolean> {
        if (!context.args[0].handshake.headers.authorization) {
            throw new UnauthorizedException('Missing authorization header');
        }
        const bearerToken =
            context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const payload = await this.jwtService.verify(bearerToken, {
                secret: this.appConfigService.jwtSecret,
            });
            const socket: Socket = context.switchToWs().getClient();
            socket.data.user = payload.sub;
        } catch {
            throw new UnauthorizedException('Le token renseigné est invalide');
        }
        return true;
    }
}
