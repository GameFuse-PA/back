import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get jwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET');
    }

    get jwtExpiration(): number {
        return this.configService.get<number>('JWT_EXPIRATION');
    }

    get mongoUri(): string {
        return this.configService.get<string>('MONGO_URI');
    }

    get awsAccessKeyId(): string {
        return this.configService.get<string>('AWS_ACCESS_KEY_ID');
    }

    get awsSecretAccessKey(): string {
        return this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    }

    get awsRegion(): string {
        return this.configService.get<string>('AWS_REGION');
    }

    get awsBucketName(): string {
        return this.configService.get<string>('AWS_BUCKET_NAME');
    }

    get mailjetApiKey(): string {
        return this.configService.get<string>('MAILJET_API_KEY');
    }

    get mailjetApiSecret(): string {
        return this.configService.get<string>('MAILJET_API_SECRET');
    }

    get mailjetEmail(): string {
        return this.configService.get<string>('MAILJET_EMAIL_FROM');
    }

    get frontUrl(): string {
        return this.configService.get<string>('FRONT_URL');
    }

    getPythonRunCommand(): string {
        return this.configService.get<string>('PYTHON_COMMAND');
    }

    getJavaRunCommand(): string {
        return this.configService.get<string>('JAVA_COMMAND');
    }

    getCRunCommand(): string {
        return this.configService.get<string>('C_COMMAND');
    }

    getIncludePath(): string {
        return this.configService.get<string>('INCLUDE_PATH');
    }

    getLibPath(): string {
        return this.configService.get<string>('LIBRARY_PATH');
    }
}
