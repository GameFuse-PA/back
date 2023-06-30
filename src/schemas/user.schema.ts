import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Document } from 'mongoose';
import { File } from './file.schema';

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
        type: MongooseSchema.Types.ObjectId,
        ref: 'File',
    })
    avatar: File;
}

export const UserSchema = SchemaFactory.createForClass(User);
