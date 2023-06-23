import {
    HydratedDocument,
    Schema as MongooseSchema,
    Document,
    Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PartiesDocument = HydratedDocument<Parties>;

@Schema({ versionKey: false, timestamps: true })
export class Parties extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    createdBy: Types.ObjectId;

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        default: [],
    })
    members: Types.ObjectId[];

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'Game',
    })
    game: Types.ObjectId;

    @Prop({
        required: false,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    winner: Types.ObjectId;

    @Prop({
        required: true,
        type: MongooseSchema.Types.Number,
    })
    status: number;
}

export const PartiesSchema = SchemaFactory.createForClass(Parties);
