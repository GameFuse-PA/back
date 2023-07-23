import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { CommonModule } from '../common/common.module';
import { InvitationsModule } from '../invitations/invitations.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { MailModule } from '../mail/mail.module';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
            imports: [
                UsersModule,
                InvitationsModule,
                ConfigurationModule,
                MailModule,
                CommonModule,
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
