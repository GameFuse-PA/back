import { Test, TestingModule } from '@nestjs/testing';
import { RunnerService } from './runner.service';
import { CommonModule } from '../common/common.module';
import { RunnerModule } from './runner.module';
import { GameSessionModule } from '../game-session/game-session.module';
import { FileModule } from '../amazon/file.module';

describe('RunnerService', () => {
    let service: RunnerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RunnerService],
            imports: [
                RunnerModule,
                GameSessionModule,
                FileModule,
                CommonModule,
            ],
        }).compile();

        service = module.get<RunnerService>(RunnerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
