import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Score, ScoreDocument } from '../schemas/score.schema';

@Injectable()
export class ScoreboardService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(Score.name)
        private readonly scoreModel: Model<ScoreDocument>,
    ) {}

    async getScoreboard(gameId?: string, userSearch?: string) {
        const users = await this.userModel
            .find(
                userSearch
                    ? { username: { $regex: userSearch, $options: 'i' } }
                    : {},
            )
            .populate({
                path: 'scores',
                match: gameId ? { game: gameId } : {},
            })
            .exec();

        return users.filter((user) => user.scores.length > 0);
    }
}
