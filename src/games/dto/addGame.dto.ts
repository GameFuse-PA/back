import { IsNotEmpty } from 'class-validator';
import { Express } from 'express';

export class AddGameDto {
    @IsNotEmpty({ message: 'Nom requis' })
    name: string;

    @IsNotEmpty({ message: 'Description requise' })
    description: string;

    @IsNotEmpty({ message: 'Logo requis' })
    logo: Express.Multer.File;

    @IsNotEmpty({ message: 'Bannière requise' })
    banner: Express.Multer.File;

    @IsNotEmpty({ message: 'Fichier requis' })
    file: Express.Multer.File;
}
