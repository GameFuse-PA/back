import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailjetService, SendEmailV3_1 } from 'nest-mailjet';
import { AppConfigService } from './app.config.service';

@Injectable()
export class NotificationsConfigService {
    constructor(
        private readonly mailjetServices: MailjetService,
        private readonly appConfiguration: AppConfigService,
    ) {}

    async sendEmail(email: string, subject: string, message: string) {
        const messages: SendEmailV3_1.IBody = {
            Messages: [
                {
                    From: {
                        Email: this.appConfiguration.mailjetEmail,
                        Name: 'Support Gamefuse',
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: message,
                },
            ],
        };
        const mail = await this.mailjetServices.send(messages);

        if (mail.response.status === 200) {
            return { message: 'Mail bien envoyé' };
        }

        throw new InternalServerErrorException(mail.body.Messages);
    }
}
