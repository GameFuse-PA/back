import { Injectable } from '@nestjs/common';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { AppConfigService } from '../configuration/app.config.service';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../schemas/file.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

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
            endpoint: `https://s3.${this.appConfigService.awsRegion}.${this.appConfigService.bucketDomain}`,
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
                ACL: 'public-read',
            };
            const command = new PutObjectCommand(params);
            const upload = await this.s3.send(command);

            const url = `https://${this.appConfigService.awsBucketName}.s3.${this.appConfigService.awsRegion}.${this.appConfigService.bucketDomain}/${path}/${fileName}`;

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

    async deleteFile(fileId: string, path: string) {
        try {
            const file = await this.fileModel.findById(fileId).exec();

            const params = {
                Bucket: this.appConfigService.awsBucketName,
                Key: `${path}/${file.name}`,
            };
            const command = new DeleteObjectCommand(params);
            await this.s3.send(command);

            return await this.fileModel.findByIdAndDelete(fileId);
        } catch (e) {
            throw new Error(
                `Erreur lors de la suppression du fichier. Error: ${e}`,
            );
        }
    }

    async downloadFile(fileId: string, outputDir: string, bucketPath: string) {
        try {
            const file = await this.fileModel.findById(fileId).exec();

            const params = {
                Bucket: this.appConfigService.awsBucketName,
                Key: `${bucketPath}/${file.name}`,
            };

            const stream = await this.s3.send(new GetObjectCommand(params));

            const data = stream.Body as any;

            const filePath = path.join(__dirname, `../../${outputDir}`);
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            const fileStream = fs.createWriteStream(`${filePath}/${file.name}`);

            data.pipe(fileStream);

            return `${filePath}/${file.name}`;
        } catch (e) {
            throw new Error(
                `Erreur lors de la récupération du fichier. Error: ${e}`,
            );
        }
    }
}
