import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { env } from './config';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: env.nats_servers
    }
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory(errors) {
          throw new RpcException({ status: HttpStatus.PRECONDITION_FAILED, message: errors })
      },
    })
  )
  await app.listen();
  console.log(`Products ms running ${env.port}`)
}
bootstrap();
