import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppConfigService } from '../configuration/app.config.service';

@Injectable()
export class FileService {
    private s3: S3Client;

    constructor(private appConfigService: AppConfigService) {
        this.s3 = new S3Client({
            region: this.appConfigService.awsRegion,
            credentials: {
                accessKeyId: this.appConfigService.awsAccessKeyId,
                secretAccessKey: this.appConfigService.awsSecretAccessKey,
            },
        });
    }

    async uploadFile(dataBuffer: Buffer, fileName: string) {
        try {
            const params = {
                Bucket: this.appConfigService.awsBucketName,
                Key: fileName,
                Body: dataBuffer,
            };
            const command = new PutObjectCommand(params);
            return await this.s3.send(command);
        } catch (e) {
            throw new Error(`Erreur lors de l'upload du fichier. Error: ${e}`);
        }
    }
}
