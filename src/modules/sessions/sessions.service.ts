import { Injectable, NotFoundException } from '@nestjs/common'
import { MessageDto } from '../../common/dto/message.dto'
import { PrismaClientTransaction } from '../../config/env/prisma/prisma.interface'
import { UsersService } from '../users/users.service'
import { CreateSessionDto } from './dto/create-session.dto'
import { UpdateSessionDto } from './dto/update-session.dto'
import { SessionWithNotRelationsEntity } from './entities/session.entity'
import { SessionRepository } from './repositories/sessions.repository'

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly usersService: UsersService
  ) {}

  async createSession(
    tx: PrismaClientTransaction,
    data: CreateSessionDto
  ): Promise<SessionWithNotRelationsEntity> {
    await this.usersService.findUserByIdOrThrow(tx, data.userId, {
      deletedAt: null,
      disabledAt: null
    })

    await this.sessionRepository.disableAllSessionByUser(tx, data.userId)

    return await this.sessionRepository.createSession(tx, data)
  }

  async updateSession(
    tx: PrismaClientTransaction,
    id: string,
    data: UpdateSessionDto
  ) {
    await this.findSessionByIdOrThrow(tx, id)

    return await this.sessionRepository.updateSession(tx, id, data)
  }

  async findSessionById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity> {
    return await this.sessionRepository.findSessionById(tx, id)
  }

  async findAllSessionByUser(
    tx: PrismaClientTransaction,
    userId: string
  ): Promise<SessionWithNotRelationsEntity[]> {
    await this.usersService.findUserByIdOrThrow(tx, userId, {
      deletedAt: null,
      disabledAt: null
    })

    return await this.sessionRepository.findAllSessionByUser(tx, userId)
  }

  async findAllSession(
    tx: PrismaClientTransaction
  ): Promise<SessionWithNotRelationsEntity[]> {
    return await this.sessionRepository.findAllSession(tx)
  }

  async disableSessionById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity> {
    await this.findSessionByIdOrThrow(tx, id)

    return await this.sessionRepository.disableSessionById(tx, id)
  }

  async disableAllSessionByUser(
    tx: PrismaClientTransaction,
    userId: string
  ): Promise<MessageDto> {
    await this.usersService.findUserByIdOrThrow(tx, userId, {
      deletedAt: null,
      disabledAt: null
    })

    await this.sessionRepository.disableAllSessionByUser(tx, userId)

    return { message: 'All sessions disabled by userId.' }
  }

  async disableAllSession(tx: PrismaClientTransaction): Promise<MessageDto> {
    await this.sessionRepository.disableAllSession(tx)

    return { message: 'All sessions disabled.' }
  }

  async findSessionByIdOrThrow(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity> {
    const session = await this.findSessionById(tx, id)

    if (!session) {
      throw new NotFoundException('Session not found.')
    }

    return session
  }
}
