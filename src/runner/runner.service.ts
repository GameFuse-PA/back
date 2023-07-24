import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { GameSessionService } from '../game-session/game-session.service';
import { FileService } from '../amazon/file.service';
import { spawn, exec } from 'child_process';
import { GameActionDto } from './dto/gameAction.dto';
import * as fs from 'fs';
import { Action, ActionDocument } from '../schemas/action.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    GameSessions,
    GameSessionsDocument,
} from '../schemas/game-sessions.schema';
import { User } from '../schemas/user.schema';
import { GameSessionStatus } from '../game-session/enum/game-session.enum';
import { LanguageEnum } from '../games/enum/language.enum';
import { AppConfigService } from '../configuration/app.config.service';
import { Score, ScoreDocument } from '../schemas/score.schema';

@Injectable()
export class RunnerService {
    constructor(
        private gameSessionService: GameSessionService,
        private fileService: FileService,
        @InjectModel(Action.name)
        private readonly actionModel: Model<ActionDocument>,
        @InjectModel(GameSessions.name)
        private readonly gameSessionModel: Model<GameSessionsDocument>,
        @InjectModel(Score.name)
        private readonly scoreModel: Model<ScoreDocument>,
        private appConfigService: AppConfigService,
    ) {}

    async retrieveGameSessionState(
        gameSessionId: string,
        action?: GameActionDto,
        userId?: string,
    ) {
        const gameSession = await this.gameSessionService.getGameSessionById(
            gameSessionId,
        );

        if (!gameSession) {
            throw new NotFoundException("La session de jeu n'existe pas");
        }

        const init = await this.initRunner(gameSession);

        const process = init.process;
        let res = init.res as any;

        if (gameSession.actions.length > 0) {
            res = await this.runPastActions(gameSession, process);
        }

        if (action && userId) {
            const player = this.checkPlayerCanPlay(
                res.requested_actions,
                userId,
                gameSession,
            );
            res = await this.runNewAction(gameSession, player, process, action);

            if (res.game_state.game_over == true) {
                const winnerIndex = res.game_state.scores.findIndex(
                    (score: any) => score == 1,
                );

                const winner = gameSession.players[winnerIndex];

                gameSession.winner = winner;
                gameSession.status = GameSessionStatus.Terminated;
                await gameSession.save();

                const score = await this.scoreModel.create({
                    game: gameSession.game,
                });

                winner.scores.push(score);
                await winner.save();
            }
        }

        process.stdin.end();
        process.kill();

        return await this.buildResponse(res, gameSessionId);
    }

    private async run(process: any, input: string) {
        console.log(input)
        process.stdin.write(input + "\n" );

        return new Promise((resolve, reject) => {
            process.stdout.on('data', (data: any) => {
                process.stdout.removeAllListeners('data');
                console.log('stdout', data.toString())
                resolve(JSON.parse(data) as any);
            });
            process.stderr.on('data', (data: any) => {
                process.stderr.removeAllListeners('data');
                console.log('stderr', data.toString())
                reject(data);
            });

        });
    }

    private buildInitArgs(playersNb: number) {
        return {
            init: {
                players: playersNb,
            },
        };
    }

    private getRunCommand(language: LanguageEnum) {
        switch (language) {
            case LanguageEnum.Python:
                return this.appConfigService.getPythonRunCommand();
            case LanguageEnum.Java:
                return this.appConfigService.getJavaRunCommand();
            case LanguageEnum.C:
                return `cmd.exe`;
            default:
                throw new BadRequestException('Langage non supporté');
        }
    }

    private async downloadGameFiles(game: any, outputDir: string) {
        if (!fs.existsSync(outputDir + `/${game.program.name}`)) {
            await this.fileService.downloadFile(
                game.program._id,
                outputDir,
                'game-program',
            );
        }

        if (!fs.existsSync(outputDir + `/${game.entry.name}`)) {
            await this.fileService.downloadFile(
                game.entry._id,
                outputDir,
                'game-entry',
            );
        }
    }

    private async buildResponse(json: any, gameSessionId: string) {
        const gameSession = await this.gameSessionService.getGameSessionById(
            gameSessionId,
        );

        json.displays.forEach((display: any) => {
            display.player = gameSession.players[display.player - 1];
        });

        json.requested_actions.forEach((actions: any) => {
            actions.player = gameSession.players[actions.player - 1];
        });

        if (json.game_state.game_over == true) {
            json.game_state.winner = gameSession.winner;
        }

        return json;
    }

    private async initRunner(gameSession: GameSessions) {
        const outputDir = `sessions/${gameSession._id}`;
        const game = gameSession.game;

        await this.downloadGameFiles(game, outputDir);

        let processArgs = [];
        let argumentsGcc = [];

        console.log('language', game.language);

        if (game.language === LanguageEnum.Java) {
            processArgs = ['-jar', `${outputDir}/${game.program.name}`];
        } else if (game.language === LanguageEnum.C) {
            console.log(`-o main ${outputDir}/${game.program.name} -I ${this.appConfigService.getIncludePath()} -L ${this.appConfigService.getLibPath()} -ljson-c`)
            /*argumentsGcc = [
                '-o',
                `${outputDir}/main`,
                `${outputDir}/${game.program.name}`,
                '-I',
                `${this.appConfigService.getIncludePath()}`,
                '-L',
                `${this.appConfigService.getLibPath()}`,
                '-ljson-c'
            ];

            const pr = spawn('gcc', argumentsGcc);
            console.log("gcc")*/
            //exec(`sudo chmod -X ${outputDir}/main`);
        } else {
            processArgs = [`${outputDir}/${game.program.name}`];
        }

        const process = spawn(this.getRunCommand(game.language), processArgs);

        const args = this.buildInitArgs(gameSession.players.length);
        const res = (await this.run(process, JSON.stringify(args))) as any;

        if (res.errors) {
            throw new BadRequestException('Impossible de lancer la partie');
        }

        return {
            process,
            res,
        };
    }

    private async runPastActions(gameSession: GameSessions, process: any) {
        const actions = gameSession.actions;

        let res;

        for (const pastAction of actions) {
            const player = gameSession.players.find(
                (player) =>
                    player._id.toString() == pastAction.player._id.toString(),
            );

            const indexOfPlayer = gameSession.players.indexOf(player) + 1;

            const input = {
                actions: [
                    {
                        x: pastAction.x,
                        y: pastAction.y,
                        text: pastAction.text,
                        key: pastAction.key,
                        type: pastAction.type,
                        player: indexOfPlayer,
                        button: pastAction.button,
                    },
                ],
            };

            res = await this.run(process, JSON.stringify(input));

            if (res.errors) {
                throw new BadRequestException(
                    "Impossible de récupérer l'état de la partie",
                );
            }
        }

        return res;
    }

    private async runNewAction(
        gameSession: GameSessions,
        player: User,
        process: any,
        action: GameActionDto,
    ) {
        const indexOfPlayer = gameSession.players.indexOf(player) + 1;

        const input = {
            actions: [
                {
                    ...action,
                    player: indexOfPlayer,
                },
            ],
        };

        const res = (await this.run(process, JSON.stringify(input))) as any;

        if (res.errors) {
            throw new BadRequestException('Action invalide');
        }

        const actionToSave = new this.actionModel({
            ...action,
            player: player._id,
        });

        await actionToSave.save();

        gameSession.actions.push(actionToSave);
        await gameSession.save();

        return res;
    }

    private checkPlayerCanPlay(
        possibleActions: any,
        userId: string,
        gameSession: GameSessions,
    ) {
        if (gameSession.status == GameSessionStatus.Terminated) {
            throw new BadRequestException('La session de jeu est terminée');
        }

        const player = gameSession.players.find(
            (player) => player._id.toString() == userId,
        );

        const indexOfPlayer = gameSession.players.indexOf(player) + 1;

        const canPlay = possibleActions.some(
            (action: any) => action.player === indexOfPlayer,
        );

        if (!canPlay) {
            throw new BadRequestException("Ce n'est pas à votre tour de jouer");
        }

        return player;
    }

    public async resetGameSession(gameSessionId: string) {
        const gameSession = await this.gameSessionService.getGameSessionById(
            gameSessionId,
        );

        if (!gameSession) {
            throw new NotFoundException("La session de jeu n'existe pas");
        }

        gameSession.actions = [];
        gameSession.winner = null;
        gameSession.status = GameSessionStatus.In_Progress;

        return await gameSession.save();
    }

    public async alterActions(gameSessionId: string, actionId: string) {
        const gameSession = await this.gameSessionService.getGameSessionById(
            gameSessionId,
        );

        if (!gameSession) {
            throw new NotFoundException("La session de jeu n'existe pas");
        }

        const index = gameSession.actions.findIndex(
            (action) => action._id.toString() == actionId,
        );

        if (index == -1) {
            throw new NotFoundException("L'action n'existe pas");
        }

        gameSession.actions = gameSession.actions.slice(0, index + 1);
        gameSession.winner = null;
        gameSession.status = GameSessionStatus.In_Progress;

        return await gameSession.save();
    }
}
