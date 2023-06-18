import { Module } from '@nestjs/common';
import { RunnerService } from './runner.service';
import { RunnerController } from './runner.controller';
import { FileModule } from '../amazon/file.module';
import { GamesModule } from '../games/games.module';
import { RunnerPythonService } from './runner.python.service';

@Module({
    imports: [FileModule, GamesModule],
    providers: [RunnerService, RunnerPythonService],
    controllers: [RunnerController],
})
export class RunnerModule {}
