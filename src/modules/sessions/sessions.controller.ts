import { Body, Controller, Post } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { CreateSessionDto } from './dto/create-session.dto'
import { SessionsService } from './sessions.service'

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly sessionsService: SessionsService
  ) {}

  @IsPublic()
  @Post()
  async createSession(@Body() dto: CreateSessionDto) {
    return await this.sessionsService.createSession(this.prisma, dto)
  }
}
