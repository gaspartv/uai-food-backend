import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/env/prisma/prisma.module'
import { UsersModule } from '../users/users.module'
import { SessionPrismaRepository } from './repositories/prisma/sessions.prisma.repository'
import { SessionRepository } from './repositories/sessions.repository'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    { provide: SessionRepository, useClass: SessionPrismaRepository }
  ],
  exports: [SessionsService]
})
export class SessionsModule {}
