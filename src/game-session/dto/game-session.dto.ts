import { IsNotEmpty, IsOptional } from 'class-validator';

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
}
