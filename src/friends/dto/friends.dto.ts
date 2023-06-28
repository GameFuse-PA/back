import { IsNotEmpty, IsOptional } from 'class-validator';

export class FriendsDto {
    @IsOptional()
    idUser: string;

    @IsNotEmpty({ message: "Info de l'ami requis" })
    idFriends: string;
}
