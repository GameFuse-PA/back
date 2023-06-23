import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { RunnerService } from './runner.service';

@Controller('games')
export class RunnerController {
    constructor(private runnerService: RunnerService) {}

    @Get(':id/start')
    async start(@Param('id') gameId: string) {
        return {
            message: await this.runnerService.start(gameId),
        };
    }

    @Post(':pid/message')
    async sendMessage(@Param('pid') pid: number) {
        return {
            message: await this.runnerService.sendMessage(pid, 'Test'),
        };
    }
}
