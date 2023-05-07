import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { AddGameDto } from './dto/addGame.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('games')
export class GamesController {
    constructor(private gamesService: GamesService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('logo', {
            dest: './uploads/img',
        }),
        FileInterceptor('banner', {
            dest: './uploads/img',
        }),
        FileInterceptor('file', {
            dest: './uploads/file',
        }),
    )
    addGame(
        @Body() addGameDto: AddGameDto,
        @UploadedFile() logo: Express.Multer.File,
        @UploadedFile() banner: Express.Multer.File,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return 'Game added';
    }
}
