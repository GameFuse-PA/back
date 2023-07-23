import { IsDate, IsEmail, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProfilDto {
    @MinLength(2, { message: 'Le pseudo doit avoir minimum 2 caractères' })
    @IsOptional()
    username: string;

    @IsEmail({}, { message: 'Email invalide' })
    @IsOptional()
    email: string;

    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @IsOptional()
    birthdate: Date;

    @MinLength(2, { message: 'Le prénom doit avoir minimum 2 caractères' })
    @IsOptional()
    firstname: string;

    @MinLength(2, {
        message: 'Le nom de famille doit avoir minimum 2 caractères',
    })
    @IsOptional()
    lastname: string;
}
