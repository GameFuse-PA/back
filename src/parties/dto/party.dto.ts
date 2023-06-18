import { IsNotEmpty, IsOptional } from 'class-validator';

export class PartyDto {
    @IsOptional()
    createdBy: string;

    @IsNotEmpty({ message: 'Nom requis' })
    members: string[];

    @IsNotEmpty({ message: 'Un jeu est requis' })
    game: string;

    @IsOptional()
    winner: string;
}
