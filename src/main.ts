import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import fastifyFileUpload from 'fastify-file-upload'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  // CONFIGURAÇÃO DO REDIS
  // await app.register(RedisModule, {
  //   host: process.env.REDIS_HOST || 'localhost',
  //   port: process.env.PORT_REDIS || 6379
  // })

  /// PROTEÇÃO PARA O CABEÇALHO DA APLICAÇÃO ///
  await app.register(helmet)

  /// TRATAMENTO DO CORS ///
  await app.register(cors)

  /// CONFIGURAÇÃO DO UPLOAD DE IMAGENS ///
  app.register(fastifyFileUpload, {
    limits: { fileSize: 1024 * 1024 * 5 },
    useTempFiles: true,
    tempFileDir: 'tmp',
    createParentPath: true,
    uriDecodeFileNames: true,
    safeFileNames: '/.(jpg|jpeg|png)$/i',
    preserveExtension: true
  })

  /// VALIDAÇÃO ///
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ['transform'] }
    })
  )

  /// DOCUMENTAÇÃO ///
  const config = new DocumentBuilder()
    .setTitle('API Uai-food')
    .setDescription('API para a rede de lojas da UAI-food')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  /// INICIAR O SERVIDOR ///
  const port = process.env.PORT || 8080

  await app.listen(port, '0.0.0.0')
}

bootstrap()
