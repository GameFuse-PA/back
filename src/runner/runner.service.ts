import { Injectable } from '@nestjs/common';
import { FileService } from '../amazon/file.service';
import { GamesService } from '../games/games.service';
import { RunnerPythonService } from './runner.python.service';
import * as fs from 'fs';

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

        const files = fs.readdirSync('./' + path);

        const file = files.find((file) => file.endsWith('.py'));

        return await this.runnerPythonService.run(path + '/' + file);
    }

    async sendMessage(pid: number, message: string) {
        return await this.runnerPythonService.sendMessage(pid, message);
    }
}
