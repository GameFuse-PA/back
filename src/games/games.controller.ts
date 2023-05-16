import {
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { AddGameDto } from './dto/addGame.dto';

@Controller('games')
export class GamesController {
    constructor(private gamesService: GamesService) {}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'banner', maxCount: 1 },
            { name: 'program', maxCount: 1 },
        ]),
    )
    addGame(
        @UploadedFiles()
        files: {
            banner: Express.Multer.File[];
            program: Express.Multer.File[];
        },
        @Body() addGameDto: any,
    ) {
        return this.gamesService.addGame(
            addGameDto,
            files.banner[0],
            files.program[0],
        );
    }
}
