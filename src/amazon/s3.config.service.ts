import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { AppConfigService } from '../configuration/app.config.service';

@Injectable()
export class S3ConfigService {
    private s3: S3;

    constructor(private appConfigService: AppConfigService) {
        this.s3 = new S3({
            region: this.appConfigService.awsRegion,
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
            throw new Error(`Could not upload file. Error: ${e}`);
        }
    }
}
