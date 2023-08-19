import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import { PrismaService } from '../../src/config/env/prisma/prisma.service'

export class PrismaTestUtils {
  static async run() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    const app: NestFastifyApplication = moduleFixture.createNestApplication()
    await app.init()

    const prisma: PrismaService = new PrismaService()

    return { app, prisma }
  }
}
