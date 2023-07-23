import { Test, TestingModule } from '@nestjs/testing';
import { RunnerController } from './runner.controller';
import { CommonModule } from '../common/common.module';
import { RunnerModule } from './runner.module';
import { GameSessionModule } from '../game-session/game-session.module';

describe('RunnerController', () => {
    let controller: RunnerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RunnerController],
            imports: [RunnerModule, GameSessionModule, CommonModule],
        }).compile();

        controller = module.get<RunnerController>(RunnerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
