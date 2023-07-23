import { IsNotEmpty } from 'class-validator';

export class EntryArgumentDto {
    @IsNotEmpty({ message: 'Nom requis' })
    name: string;

    @IsNotEmpty({ message: 'Description requise' })
    description: string;

    @IsNotEmpty({ message: 'Type requis' })
    type: string;

    @IsNotEmpty({ message: 'Minimum requis' })
    min: number;

    @IsNotEmpty({ message: 'Maximum requis' })
    max: number;
}
