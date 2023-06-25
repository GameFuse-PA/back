import { Module } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { GameSessionController } from './game-session.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    providers: [GameSessionService],
    controllers: [GameSessionController],
    exports: [GameSessionService],
})
export class GameSessionModule {}
