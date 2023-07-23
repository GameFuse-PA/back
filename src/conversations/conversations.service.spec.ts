import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { ConversationsModule } from './conversations.module';
import { CommonModule } from '../common/common.module';

describe('ConversationsService', () => {
    let service: ConversationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConversationsService],
            imports: [ConversationsModule, CommonModule],
        }).compile();

        service = module.get<ConversationsService>(ConversationsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
