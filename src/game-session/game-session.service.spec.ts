import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionService } from './game-session.service';
import { GameSessionModule } from './game-session.module';
import { CommonModule } from '../common/common.module';

describe('GameSessionService', () => {
    let service: GameSessionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameSessionService],
            imports: [GameSessionModule, CommonModule],
        }).compile();

        service = module.get<GameSessionService>(GameSessionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
