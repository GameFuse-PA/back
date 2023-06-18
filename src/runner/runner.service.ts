import { Injectable } from '@nestjs/common';
import { FileService } from '../amazon/file.service';
import { GamesService } from '../games/games.service';
import { RunnerPythonService } from './runner.python.service';

@Injectable()
export class RunnerService {
    constructor(
        private fileService: FileService,
        private gameService: GamesService,
        private runnerPythonService: RunnerPythonService,
    ) {}

    async start(gameId: string) {
        const game = await this.gameService.getGame(gameId);
        const path = await this.fileService.unzipFile(game.program._id);

        return await this.runnerPythonService.run(path + '/test.py');
    }
}
