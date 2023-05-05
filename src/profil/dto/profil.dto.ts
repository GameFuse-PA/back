import { IsDate, IsEmail, MinLength } from 'class-validator';

export class ProfilDto {
    @MinLength(2, { message: 'Le pseudo doit avoir minimum 2 caractères' })
    username: string;

    @IsEmail({}, { message: 'Email invalide' })
    email: string;

    @IsDate({ message: 'Date invalide' })
    birthDate: Date;

    @MinLength(2, { message: 'Le prénom doit avoir minimum 2 caractères' })
    firstName: string;

    @MinLength(2, { message: 'Le prénom doit avoir minimum 2 caractères' })
    lastName: string;
}
