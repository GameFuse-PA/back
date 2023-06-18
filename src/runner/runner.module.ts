import { Module } from '@nestjs/common';
import { RunnerService } from './runner.service';
import { RunnerController } from './runner.controller';
import { FileModule } from '../amazon/file.module';
import { GamesModule } from '../games/games.module';

@Module({
    imports: [FileModule, GamesModule],
    providers: [RunnerService],
    controllers: [RunnerController],
})
export class RunnerModule {}
