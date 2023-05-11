import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as mustache from 'mustache';

@Injectable()
export class MailConfigService {
    private readonly mailTemplates: any;

    constructor() {
        const mailData = fs.readFileSync('src/utils/mails.json', 'utf8');
        this.mailTemplates = JSON.parse(mailData);
    }

    getResetPasswordMail(token: string) {
        const mail = this.mailTemplates.forgotPassword;
        return {
            subject: mail.subject,
            body: this.renderMailBody(mail.html, { token }),
        };
    }

    private renderMailBody(template: string, variables: any): string {
        return mustache.render(template, variables);
    }
}
