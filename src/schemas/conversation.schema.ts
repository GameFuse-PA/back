import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
    Document,
    HydratedDocument,
    Schema as MongooseSchema,
    Types,
} from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;
export type MessageDocument = HydratedDocument<Message>;

interface Message extends Document {
    text: string;
    from: Types.ObjectId;
    date: Date;
}

export class Conversation extends Document {
    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    })
    users: Types.ObjectId[];

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.Map }],
        default: [],
    })
    messages: MessageDocument[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
