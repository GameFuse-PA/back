import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class RunnerPythonService {
    async exec(filePath: string) {
        exec(`python ${filePath}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(stdout);
        });
    }
}
