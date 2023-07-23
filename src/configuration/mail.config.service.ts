import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as mustache from 'mustache';
import { AppConfigService } from './app.config.service';

@Injectable()
export class MailConfigService {
    private readonly mailTemplates: any;

    constructor(private readonly appConfiguration: AppConfigService) {
        const mailData = fs.readFileSync('src/utils/mails.json', 'utf8');
        this.mailTemplates = JSON.parse(mailData);
    }

    getResetPasswordMail(token: string) {
        const mail = this.mailTemplates.forgotPassword;
        const urlFront = this.appConfiguration.frontUrl;
        return {
            subject: mail.subject,
            body: this.renderMailBody(mail.html, { urlFront, token }),
        };
    }

    getFriendRequestMail(username: string, token: string) {
        const mail = this.mailTemplates.invitations;
        const urlFront = this.appConfiguration.frontUrl;
        return {
            subject: mail.subject,
            body: this.renderMailBody(mail.html, { username, token, urlFront }),
        };
    }

    private renderMailBody(template: string, variables: any): string {
        return mustache.render(template, variables);
    }
}
