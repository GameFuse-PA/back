import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatService } from './liveChat.service';
import { LiveChatModule } from './liveChat.module';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../users/users.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { GameSessionModule } from '../game-session/game-session.module';

describe('AuthService', () => {
    let service: LiveChatService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LiveChatService],
            imports: [
                LiveChatModule,
                UsersModule,
                ConversationsModule,
                GameSessionModule,
                CommonModule,
            ],
        }).compile();

        service = module.get<LiveChatService>(LiveChatService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
