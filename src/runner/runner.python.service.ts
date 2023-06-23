import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class RunnerPythonService {
    childProcesses = [];
    async run(filePath: string) {
        const res = exec(`python ${filePath}`);

        return new Promise((resolve, reject) => {
            res.stdout.on('data', (data) => {
                this.childProcesses[res.pid] = res;
                resolve({
                    output: data,
                    pid: res.pid,
                });
            });
            res.stderr.on('data', (data) => {
                reject(data);
            });
        });
    }

    async sendMessage(pid: number, input: string) {
        const res = this.childProcesses[pid];
        if (!res) {
            console.log('Process not found');
        }
        res.stdin.write(input + '\n');

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
