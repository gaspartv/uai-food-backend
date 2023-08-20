import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PrismaClientTransaction } from '../../../../config/env/prisma/prisma.interface'
import { SessionWithNotRelationsEntity } from '../../entities/session.entity'
import { SessionRepository } from '../sessions.repository'

@Injectable()
export class SessionMemoryRepository implements SessionRepository {
  private sessions: SessionWithNotRelationsEntity[] = []

  async createSession(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tx: PrismaClientTransaction,
    data: Prisma.SessionUncheckedCreateInput
  ): Promise<SessionWithNotRelationsEntity> {
    const session = new SessionWithNotRelationsEntity()
    session.id = randomUUID()
    session.loggedIn = new Date()
    session.loggedOutAt = null

    Object.assign(session, data)

    this.sessions.push(session)

    return session
  }

  async findSessionById(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity> {
    return this.sessions.find((session) => session.id === id)
  }

  async findAllSessionByUser(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tx: PrismaClientTransaction,
    userId: string
  ): Promise<SessionWithNotRelationsEntity[]> {
    return this.sessions.filter((session) => session.userId === userId)
  }

  async findAllSession(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tx: PrismaClientTransaction
  ): Promise<SessionWithNotRelationsEntity[]> {
    return this.sessions
  }

  async disableSessionById(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity> {
    const session = this.sessions.find((session) => session.id === id)

    if (session) {
      session.loggedOutAt = new Date()
    }

    return session
  }

  async disableAllSessionByUser(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tx: PrismaClientTransaction,
    userId: string
  ): Promise<Prisma.BatchPayload> {
    const sessionsToDisable = this.sessions.filter(
      (session) => session.userId === userId && !session.loggedOutAt
    )

    sessionsToDisable.forEach((session) => (session.loggedOutAt = new Date()))

    const result: Prisma.BatchPayload = {
      count: sessionsToDisable.length
    }

    return result
  }

  async disableAllSession(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tx: PrismaClientTransaction
  ): Promise<Prisma.BatchPayload> {
    const sessionsToDisable = this.sessions.filter(
      (session) => !session.loggedOutAt
    )

    sessionsToDisable.forEach((session) => (session.loggedOutAt = new Date()))

    const result: Prisma.BatchPayload = {
      count: sessionsToDisable.length
    }

    return result
  }
}
