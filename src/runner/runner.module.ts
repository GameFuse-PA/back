import { Module } from '@nestjs/common';
import { RunnerController } from './runner.controller';
import { RunnerService } from './runner.service';
import { GameSessionModule } from '../game-session/game-session.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../amazon/file.module';

@Module({
    imports: [JwtModule, GameSessionModule, FileModule],
    controllers: [RunnerController],
    providers: [RunnerService],
})
export class RunnerModule {}
