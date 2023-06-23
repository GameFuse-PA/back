import { Injectable } from '@nestjs/common';
import { FileService } from '../amazon/file.service';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from '../schemas/game.schema';
import { Model } from 'mongoose';
import { AddGameDto } from './dto/addGame.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GamesService {
    constructor(
        private fileService: FileService,
        private userService: UsersService,
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    ) {}

    async addGame(
        game: AddGameDto,
        banner: Express.Multer.File,
        program: Express.Multer.File,
        entry: Express.Multer.File,
        userId: string,
    ) {
        const user = await this.userService.findOneById(userId);

        const bannerFile = await this.fileService.uploadFile(
            banner.buffer,
            `${Date.now()}.${banner.originalname.split('.').pop()}`,
            `game-banner`,
            banner.mimetype,
        );

        const programFile = await this.fileService.uploadFile(
            program.buffer,
            `${Date.now()}.${program.originalname.split('.').pop()}`,
            `game-program`,
            program.mimetype,
        );

        const entryFile = await this.fileService.uploadFile(
            entry.buffer,
            `${Date.now()}.${entry.originalname.split('.').pop()}`,
            `game-entry`,
            entry.mimetype,
        );

        const newGame = new this.gameModel({
            name: game.name,
            description: game.description,
            banner: bannerFile,
            program: programFile,
            entry: entryFile,
            createdBy: user,
        });

        return await newGame.save();
    }

    async getUserGames(userId: string) {
        return await this.gameModel
            .find({ createdBy: userId })
            .populate('banner')
            .populate('program')
            .populate('entry')
            .populate('createdBy')
            .exec();
    }

    async getGame(gameId: string) {
        return await this.gameModel
            .findById(gameId)
            .populate('banner')
            .populate('program')
            .populate('entry')
            .populate('createdBy')
            .exec();
    }

    async getGames(name: string) {
        return await this.gameModel
            .find({ name: { $regex: name, $options: 'i' } })
            .populate('banner')
            .populate('program')
            .populate('entry')
            .populate('createdBy')
            .exec();
    }

    async deleteGame(gameId: string) {
        const game = await this.gameModel.findById(gameId).exec();

        if (game) {
            await this.fileService.deleteFile(game.banner._id, `game-banner`);
            await this.fileService.deleteFile(game.program._id, `game-program`);
            await game.deleteOne();

            return true;
        }

        return false;
    }

    async updateGame(
        gameId: string,
        game: AddGameDto,
        banner: Express.Multer.File,
        program: Express.Multer.File,
        entry: Express.Multer.File,
    ) {
        const gameToUpdate = await this.gameModel.findById(gameId).exec();

        if (gameToUpdate) {
            if (banner) {
                gameToUpdate.banner = await this.UpdateGameFile(
                    gameToUpdate.banner._id,
                    banner,
                    'banner',
                );
            }

            if (program) {
                gameToUpdate.program = await this.UpdateGameFile(
                    gameToUpdate.program._id,
                    program,
                    'program',
                );
            }

            if (entry) {
                gameToUpdate.entry = await this.UpdateGameFile(
                    gameToUpdate.entry._id,
                    entry,
                    'entry',
                );
            }

            gameToUpdate.name = game.name;
            gameToUpdate.description = game.description;

            return await gameToUpdate.save();
        }

        return null;
    }

    async UpdateGameFile(
        fileId: string,
        newFile: Express.Multer.File,
        type: string,
    ) {
        await this.fileService.deleteFile(fileId, `game-${type}`);

        const gameFile = await this.fileService.uploadFile(
            newFile.buffer,
            `${Date.now()}.${newFile.mimetype.split('/')[1]}`,
            `game-${type}`,
            newFile.mimetype,
        );

        return gameFile;
    }
}
