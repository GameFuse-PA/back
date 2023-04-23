import { IsNotEmpty } from 'class-validator';

export class FriendsDto {
    @IsNotEmpty({ message: "Id de l'utilisateur requis" })
    idUser: string;

    @IsNotEmpty({ message: "Id de l'ami requis" })
    idFriend: string;
}
