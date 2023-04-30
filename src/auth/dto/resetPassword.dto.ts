import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty({ message: 'Email requis' })
    @IsEmail({}, { message: 'Email invalide' })
    email: string;
}
