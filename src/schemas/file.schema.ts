import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ versionKey: false, timestamps: true })
export class File {
    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    key: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
