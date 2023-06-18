import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class RunnerPythonService {
    async run(filePath: string) {
        const res = exec(`python ${filePath}`);

        return new Promise((resolve, reject) => {
            res.stdout.on('data', (data) => {
                resolve(data);
            });
            res.stderr.on('data', (data) => {
                reject(data);
            });
        });
    }
}
