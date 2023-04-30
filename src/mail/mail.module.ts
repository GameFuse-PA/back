import { Global, Module } from '@nestjs/common';
import { MailjetModule } from 'nest-mailjet';
import { AppConfigService } from '../configuration/app.config.service';
import { NotificationsConfigService } from '../configuration/notifications.config.service';

@Global()
@Module({
    imports: [
        MailjetModule.registerAsync({
            inject: [AppConfigService],
            useFactory: (appConfigServices: AppConfigService) => ({
                apiKey: appConfigServices.mailjetApiKey,
                apiSecret: appConfigServices.mailjetApiSecret,
            }),
        }),
    ],
    providers: [NotificationsConfigService],
    exports: [NotificationsConfigService],
})
export class MailModule {}
