import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsController } from './invitations.controller';
import { InvitationsModule } from './invitations.module';
import { FriendsModule } from '../friends/friends.module';
import { CommonModule } from '../common/common.module';

describe('InvitationsController', () => {
    let controller: InvitationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvitationsController],
            imports: [InvitationsModule, FriendsModule, CommonModule],
        }).compile();

        controller = module.get<InvitationsController>(InvitationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
