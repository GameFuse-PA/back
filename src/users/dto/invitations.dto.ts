import { IsNotEmpty } from 'class-validator';

export class InvitationsDto {
    @IsNotEmpty({ message: 'la valeur ne peut pas être vide' })
    receiver: string;
}
