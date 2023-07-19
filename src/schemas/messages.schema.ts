import {
    Document,
    HydratedDocument,
    Schema as MongooseSchema,
    Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ versionKey: false, timestamps: true })
export class Message extends Document {
    @Prop({ required: true, type: MongooseSchema.Types.String })
    content: string;

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    from: Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.Date })
    date: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

