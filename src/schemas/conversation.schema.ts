import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
    Document,
    HydratedDocument,
    Schema as MongooseSchema,
    Types,
} from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

interface Message {
    text: string;
    from: string;
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
    messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
