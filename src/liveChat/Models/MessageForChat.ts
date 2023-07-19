import { User } from '../../schemas/user.schema';

export interface MessageForChat {
    content?: string;
    to?: string;
}
