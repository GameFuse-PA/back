import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    app.enableCors({
        origin: [
            'http://localhost:4200',
            'https://gamefuse.fr',
            'https://www.gamefuse.fr',
            'https://develop.dy4skeilg164o.amplifyapp.com',
        ],
    });
    await app.listen(3000);
}
bootstrap();
