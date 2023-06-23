import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { AddGameDto } from './dto/addGame.dto';
import { GameDocument } from '../schemas/game.schema';
import { UpdateGameDto } from './dto/updateGame.dto';

@Controller('games')
export class GamesController {
    constructor(private gamesService: GamesService) {}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'banner', maxCount: 1 },
            { name: 'program', maxCount: 1 },
            { name: 'entry', maxCount: 1 },
        ]),
    )
    addGame(
        @UploadedFiles()
        files: {
            banner: Express.Multer.File[];
            program: Express.Multer.File[];
            entry: Express.Multer.File[];
        },
        @Body() addGameDto: AddGameDto,
        @Request() req,
    ) {
        if (!files.banner) {
            throw new BadRequestException('Bannière requise');
        }
        if (!files.program) {
            throw new BadRequestException('Fichier du jeu requis');
        }
        if (!files.entry) {
            throw new BadRequestException("Fichier d'entrée requis");
        }
        return this.gamesService.addGame(
            addGameDto,
            files.banner[0],
            files.program[0],
            files.entry[0],
            req.userId,
        );
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteGame(@Request() req, @Param('id') gameId: string) {
        const game = await this.gamesService.getGame(gameId);

        if (!game) {
            throw new NotFoundException('Jeu introuvable');
        }

        if (game.createdBy._id.toString() !== req.userId) {
            throw new ForbiddenException('Vous ne pouvez pas supprimer ce jeu');
        }

        return this.gamesService.deleteGame(gameId);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'banner', maxCount: 1 },
            { name: 'program', maxCount: 1 },
            { name: 'entry', maxCount: 1 },
        ]),
    )
    async updateGame(
        @UploadedFiles()
        files: {
            banner: Express.Multer.File[];
            program: Express.Multer.File[];
            entry: Express.Multer.File[];
        },
        @Body() addGameDto: UpdateGameDto,
        @Request() req,
        @Param('id') gameId: string,
    ) {
        const game = await this.gamesService.getGame(gameId);

        if (!game) {
            throw new NotFoundException('Jeu introuvable');
        }

        if (game.createdBy._id.toString() !== req.userId) {
            throw new ForbiddenException('Vous ne pouvez pas modifier ce jeu');
        }

        return this.gamesService.updateGame(
            gameId,
            addGameDto,
            files.banner ? files.banner[0] : null,
            files.program ? files.program[0] : null,
            files.entry ? files.entry[0] : null,
        );
    }

    @Get()
    async getGames(@Query('search') search: string) {
        return this.gamesService.getGames(search);
    }
}
