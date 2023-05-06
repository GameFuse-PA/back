import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../configuration/app.config.service';
import { request } from 'express';

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
            const payload = await this.jwtService.verifyAsync(bearerToken, {
                secret: this.appConfigService.jwtSecret,
            });

            request['userId'] = payload.sub;
        } catch {
            console.log('Le token renseigné est invalide');
            throw new UnauthorizedException();
        }
        return true;
    }
    //https://stackoverflow.com/questions/58670553/nestjs-gateway-websocket-how-to-send-jwt-access-token-through-socket-emit
}
