import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppConfigService } from '../configuration/app.config.service';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../schemas/file.schema';
import { Model } from 'mongoose';

@Injectable()
export class FileService {
    private s3: S3Client;

    constructor(
        private appConfigService: AppConfigService,
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
    ) {
        this.s3 = new S3Client({
            region: this.appConfigService.awsRegion,
            credentials: {
                accessKeyId: this.appConfigService.awsAccessKeyId,
                secretAccessKey: this.appConfigService.awsSecretAccessKey,
            },
        });
    }

    async uploadFile(
        dataBuffer: Buffer,
        fileName: string,
        path: string,
        contentType: string,
    ) {
        try {
            const params = {
                Bucket: this.appConfigService.awsBucketName,
                Key: `${path}/${fileName}`,
                Body: dataBuffer,
                ContentType: contentType,
            };
            const command = new PutObjectCommand(params);
            const upload = await this.s3.send(command);

            const url = `https://${this.appConfigService.awsBucketName}.s3.${this.appConfigService.awsRegion}.amazonaws.com/${path}/${fileName}`;

            const file = new this.fileModel({
                location: url,
                key: upload.ETag,
                name: fileName,
                type: contentType,
            });

            return await file.save();
        } catch (e) {
            throw new Error(`Erreur lors de l'upload du fichier. Error: ${e}`);
        }
    }
}
