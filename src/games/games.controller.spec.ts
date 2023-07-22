import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { JwtModule, JwtService } from "@nestjs/jwt";

describe('GamesController', () => {
    let controller: GamesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GamesController],
            imports: [JwtModule],
        }).compile();

        controller = module.get<GamesController>(GamesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
