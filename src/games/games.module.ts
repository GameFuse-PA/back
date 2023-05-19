import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../amazon/file.module';

@Module({
    imports: [JwtModule, FileModule],
    controllers: [GamesController],
    providers: [GamesService],
})
export class GamesModule {}
