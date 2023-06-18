import { Injectable } from '@nestjs/common';
import { FileService } from '../amazon/file.service';
import { GamesService } from '../games/games.service';

@Injectable()
export class RunnerService {
    constructor(
        private fileService: FileService,
        private gameService: GamesService,
    ) {}

    async start(gameId: string) {
        const game = await this.gameService.getGame(gameId);
        await this.fileService.unzipFile(game.program._id);
    }
}
