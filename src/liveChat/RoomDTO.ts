import { MessageDTO } from './MessageDTO';

export interface RoomDTO {
    roomId: string;
    users: string[];
    messages: MessageDTO[];
}
