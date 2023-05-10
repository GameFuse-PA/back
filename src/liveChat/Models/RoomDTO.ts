import { MessageForDb } from './MessageForDb';

export interface RoomDTO {
    roomId: string;
    users: string[];
    messages: MessageForDb[];
}
