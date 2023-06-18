import { Controller, Get, Param } from '@nestjs/common';
import { RunnerService } from './runner.service';

@Controller('games')
export class RunnerController {
    constructor(private runnerService: RunnerService) {}

    @Get(':id/start')
    async start(@Param('id') gameId: string) {
        console.log('start');
        return this.runnerService.start(gameId);
    }
}
