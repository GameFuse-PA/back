import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../amazon/file.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [JwtModule, FileModule, UsersModule],
    controllers: [GamesController],
    providers: [GamesService],
    exports: [GamesService],
})
export class GamesModule {}
