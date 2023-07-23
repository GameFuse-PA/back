import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsService } from './invitations.service';
import { InvitationsModule } from './invitations.module';
import { CommonModule } from '../common/common.module';

describe('InvitationsService', () => {
    let service: InvitationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InvitationsService],
            imports: [InvitationsModule, CommonModule],
        }).compile();

        service = module.getgit<InvitationsService>(InvitationsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
