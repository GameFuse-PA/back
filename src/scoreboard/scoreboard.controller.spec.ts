import { Test, TestingModule } from '@nestjs/testing';
import { ScoreboardController } from './scoreboard.controller';
import { ScoreboardModule } from './scoreboard.module';
import { CommonModule } from '../common/common.module';

describe('ScoreboardController', () => {
    let controller: ScoreboardController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ScoreboardModule, CommonModule],
            controllers: [ScoreboardController],
        }).compile();

        controller = module.get<ScoreboardController>(ScoreboardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
