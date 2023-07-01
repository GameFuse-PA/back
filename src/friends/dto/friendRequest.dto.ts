import { IsNotEmpty, IsOptional } from 'class-validator';

<<<<<<< HEAD:src/friends/dto/friends.dto.ts
export class FriendsDto {
    @IsOptional()
    idUser: string;

=======
export class FriendRequestDto {
>>>>>>> develop:src/friends/dto/friendRequest.dto.ts
    @IsNotEmpty({ message: "Info de l'ami requis" })
    idFriend: string;
}
