import { User } from '../../schemas/user.schema';

export interface MessageForChat {
    content?: string;
    from?: User;
    date?: number;
    conversationId: string;
}
