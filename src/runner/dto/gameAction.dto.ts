import { IsNotEmpty } from 'class-validator';

export class GameActionDto {
    @IsNotEmpty({ message: 'type requis' })
    type: string;

    x: number;

    y: number;

    key: string;

    text: string;
}
