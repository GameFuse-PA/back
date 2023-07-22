import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesModule } from './games.module';
import { CommonModule } from '../common/common.module';

describe('GamesController', () => {
    let controller: GamesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GamesController],
            imports: [GamesModule, CommonModule],
        }).compile();

        controller = module.get<GamesController>(GamesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
