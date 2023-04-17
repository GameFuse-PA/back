import { Injectable } from '@nestjs/common';
import { FriendsDto } from '../Dto/Friends.dto';

@Injectable()
export class FriendsService {
    getFriends(): string {
        return 'Friends';
    }

    async addFriend(friend: FriendsDto): Promise<FriendsDto> {
        return friend;
    }
}
