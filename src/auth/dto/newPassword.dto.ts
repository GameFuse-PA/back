import { IsNotEmpty, MinLength } from 'class-validator';

export class NewPasswordDto {
    @IsNotEmpty({ message: 'Mot de passe requis' })
    @MinLength(6, {
        message: 'Le mot de passe doit contenir au moins 6 caractères',
    })
    password: string;
}
