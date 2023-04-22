import { Document, model, Model, Schema } from 'mongoose';

interface FriendsProps {
    id: string;
    friendId: Schema.Types.ObjectId;
    pseudoFriend: string;
}

const friendsSchema = new Schema<FriendsDocument>(
    {
        id: { type: Schema.Types.ObjectId, required: true },
        friendId: { type: Schema.Types.ObjectId, required: true },
        pseudoFriend: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export type FriendsDocument = FriendsProps & Document;

export const FriendsModel: Model<FriendsDocument> = model<FriendsDocument>(
    'Friends',
    friendsSchema,
    'Friends',
);
