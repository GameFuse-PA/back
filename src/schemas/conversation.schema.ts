import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    Document,
    HydratedDocument,
    Schema as MongooseSchema,
    Types,
} from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ versionKey: false, timestamps: true })
export class Conversation extends Document {
    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    })
    users: Types.ObjectId[];

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }],
        default: [],
    })
    messages: Types.ObjectId[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
