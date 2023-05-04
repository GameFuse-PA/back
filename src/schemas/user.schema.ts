import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({
        type: { location: { type: String }, key: { type: String } },
        required: false,
    })
    avatar: { location: string; key: string };
}

export const UserSchema = SchemaFactory.createForClass(User);
