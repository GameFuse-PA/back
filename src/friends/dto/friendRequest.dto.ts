import { IsNotEmpty } from 'class-validator';
export class FriendRequestDto {
    @IsNotEmpty({ message: "Info de l'ami requis" })
    idFriend: string;
}
