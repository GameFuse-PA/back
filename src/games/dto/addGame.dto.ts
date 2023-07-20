import { IsNotEmpty } from 'class-validator';

export class AddGameDto {
    @IsNotEmpty({ message: 'Nom requis' })
    name: string;

    @IsNotEmpty({ message: 'Description requise' })
    description: string;

    @IsNotEmpty({ message: 'Language requis' })
    language: string;
}
