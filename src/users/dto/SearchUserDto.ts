import { IsNotEmpty } from 'class-validator';

export class SearchUserDto {
    @IsNotEmpty({ message: 'la valeur ne peut pas être vide' })
    search: string;
}
