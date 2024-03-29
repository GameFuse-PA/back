import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    HydratedDocument,
    Schema as MongooseSchema,
    Document,
    Types,
} from 'mongoose';
import { File } from './file.schema';
import { Score } from './score.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
    @Prop({ required: false })
    firstname: string;

    @Prop({ required: false })
    lastname: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ required: false })
    birthdate: Date;

    @Prop({ required: false, unique: true, sparse: true })
    newPasswordToken: string;

    @Prop({
        required: false,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        default: [],
    })
    friends: Types.ObjectId[];

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'File',
    })
    avatar: File;

    @Prop({
        required: false,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Score' }],
        default: [],
    })
    scores: Score[];
}

export const UserSchema = SchemaFactory.createForClass(User);
