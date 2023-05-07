import { MinLength } from 'class-validator';

export class PasswordDto {
    @MinLength(6, {
        message: 'Le mot de passe doit faire minimul 6 caractères',
    })
    password: string;
}
