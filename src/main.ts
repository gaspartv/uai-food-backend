import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import { NestInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import fastifyFileUpload from 'fastify-file-upload'
import { join } from 'path'
import { AppModule } from './app.module'
import { TransformationInterceptor } from './utils/http-response/http-global-interceptor'
import { PrismaClientExceptionFilter } from './utils/prisma-client-exception/prisma-client-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  // COOKIE
  await app.register(fastifyCookie, { secret: 'uai-food' })

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

  app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', 'tmp'),
    prefix: '/img/'
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

  const httpAdapter = app.getHttpAdapter()

  /// GLOBAL INTERCEPTORS ///
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  app.useGlobalInterceptors(new TransformationInterceptor<NestInterceptor>())

  /// DOCUMENTAÇÃO ///
  const config = new DocumentBuilder()
    .setTitle('API Uai-food')
    .setDescription('API para a rede de lojas da UAI-food')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  /// INICIAR O SERVIDOR ///
  await app
    .listen(process.env.PORT, '0.0.0.0')
    .then(() =>
      console.log(`baseURL: ${process.env.BACKEND_URL}:${process.env.PORT}`)
    )
}

bootstrap()
