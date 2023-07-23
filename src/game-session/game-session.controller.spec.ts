import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionController } from './game-session.controller';
import { GameSessionModule } from './game-session.module';
import { CommonModule } from '../common/common.module';

describe('GameSessionController', () => {
    let controller: GameSessionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameSessionController],
            imports: [GameSessionModule, CommonModule],
        }).compile();

        controller = module.get<GameSessionController>(GameSessionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
