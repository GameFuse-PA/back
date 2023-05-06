import { IsEmail, MinLength } from 'class-validator';

export class ProfilDto {
    @MinLength(2, { message: 'Le pseudo doit avoir minimum 2 caractères' })
    username: string;

    @IsEmail({}, { message: 'Email invalide' })
    email: string;

    birthDate: Date;

    @MinLength(2, { message: 'Le prénom doit avoir minimum 2 caractères' })
    firstname: string;

    @MinLength(2, {
        message: 'Le nom de famille doit avoir minimum 2 caractères',
    })
    lastname: string;
}
