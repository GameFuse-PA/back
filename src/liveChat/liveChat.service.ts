import {Injectable, NotFoundException} from '@nestjs/common';
import { MessageForDb } from './Models/MessageForDb';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message, MessageDocument} from "../schemas/message.schema";
import {Conversation, ConversationDocument, ConversationSchema} from "../schemas/conversation.schema";

@Injectable()
export class LiveChatService {
    /*constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>,
                @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>) {
    }*/
    async postMessage(messageForDb: MessageForDb, roomId: string) {
        /*const newMessage = new this.messageModel(messageForDb);
        const message = await newMessage.save();
        const conversation = await this.conversationModel.findOne({ _id: roomId });
        if (!conversation) {
            throw new NotFoundException(`Conversation with ID ${roomId} not found`);
        }
        const updateQuery = {
            $push: { messages: message._id }
        };

        await this.conversationModel.updateOne({ _id: roomId }, updateQuery);
    }

    async createRoom(roomId: string){
        console.log("on cree la room")
        const newConversation = new this.conversationModel({
            _id: roomId,
        });
        console.log("newConversation", newConversation)
        let conversation = await newConversation.save();
        console.log("conversation from db creation", conversation)
        return conversation._id;*/
    }
}
