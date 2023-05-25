import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { File } from './file.schema';
import { User } from './user.schema';

export type GameDocument = HydratedDocument<Game>;

@Schema({ versionKey: false, timestamps: true })
export class Game {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'File',
        required: true,
    })
    banner: File;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'File',
        required: true,
    })
    program: File;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    createdBy: User;
}

export const GameSchema = SchemaFactory.createForClass(Game);
