import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Pseudo requis' })
  username: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;
}
