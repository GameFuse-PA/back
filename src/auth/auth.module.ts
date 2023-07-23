import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../configuration/app.config.service';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            inject: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => ({
                secret: appConfigService.jwtSecret,
                signOptions: { expiresIn: appConfigService.jwtExpiration },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
