import { HydratedDocument, Schema as MongooseSchema, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { File } from './file.schema';
import { User } from './user.schema';
import { LanguageEnum } from '../games/enum/language.enum';

export type GameDocument = HydratedDocument<Game>;

@Schema({ versionKey: false, timestamps: true })
export class Game extends Document {
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
        ref: 'File',
        required: true,
    })
    entry: File;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    createdBy: User;

    @Prop({ required: true })
    maxPlayers: number;

    @Prop({ required: true })
    minPlayers: number;

    @Prop({ required: true, enum: LanguageEnum })
    language: LanguageEnum;
}

export const GameSchema = SchemaFactory.createForClass(Game);
