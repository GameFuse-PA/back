import { Test, TestingModule } from '@nestjs/testing';
import { ScoreboardService } from './scoreboard.service';
import { ScoreboardModule } from './scoreboard.module';
import { CommonModule } from '../common/common.module';

describe('ScoreboardService', () => {
    let service: ScoreboardService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ScoreboardModule, CommonModule],
            providers: [ScoreboardService],
        }).compile();

        service = module.get<ScoreboardService>(ScoreboardService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
