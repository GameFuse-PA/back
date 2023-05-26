import { HydratedDocument, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ versionKey: false, timestamps: true })
export class File extends Document {
    @Prop({ required: true })
    location: string;

    @Prop({ required: true, select: false })
    key: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
