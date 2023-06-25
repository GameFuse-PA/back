import { IsNotEmpty, IsOptional } from 'class-validator';
import { GameSessionStatus } from '../enum/game-session.enum';

export class GameSessionDto {
    @IsNotEmpty({ message: 'Nom requis' })
    name: string;

    @IsOptional()
    createdBy: string;

    @IsNotEmpty({
        message: 'Au moins un membre est requis pour créer la partie',
    })
    members: string[];

    @IsNotEmpty({ message: 'Un jeu est requis' })
    game: string;

    @IsOptional()
    winner: string;

    @IsNotEmpty({ message: 'Un statut est requis' })
    status: GameSessionStatus;
}
