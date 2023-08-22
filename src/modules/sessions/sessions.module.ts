import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { SessionPrismaRepository } from './repositories/prisma/sessions.prisma.repository'
import { SessionRepository } from './repositories/sessions.repository'
import { SessionsService } from './sessions.service'

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [
    SessionsService,
    { provide: SessionRepository, useClass: SessionPrismaRepository }
  ],
  exports: [SessionsService]
})
export class SessionsModule {}
