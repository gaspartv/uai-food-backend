import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/env/prisma/prisma.interface'
import { SessionWithNotRelationsEntity } from '../../entities/session.entity'
import { SessionRepository } from '../sessions.repository'

@Injectable()
export class SessionPrismaRepository implements SessionRepository {
  async createSession(
    tx: PrismaClientTransaction,
    data: Prisma.SessionUncheckedCreateInput
  ): Promise<SessionWithNotRelationsEntity> {
    return await tx.session.create({ data })
  }

  async updateSession(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.SessionUncheckedUpdateInput
  ): Promise<SessionWithNotRelationsEntity> {
    return await tx.session.update({ where: { id }, data })
  }

  async findSessionById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity> {
    return await tx.session.findFirst({ where: { id } })
  }

  async findAllSessionByUser(
    tx: PrismaClientTransaction,
    userId: string
  ): Promise<SessionWithNotRelationsEntity[]> {
    return await tx.session.findMany({ where: { userId } })
  }

  async findAllSession(
    tx: PrismaClientTransaction
  ): Promise<SessionWithNotRelationsEntity[]> {
    return await tx.session.findMany()
  }

  async disableSessionById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity> {
    return await tx.session.update({
      where: { id, loggedOutAt: null },
      data: { loggedOutAt: new Date() }
    })
  }

  async disableAllSessionByUser(
    tx: PrismaClientTransaction,
    userId: string
  ): Promise<Prisma.BatchPayload> {
    return await tx.session.updateMany({
      where: { userId, loggedOutAt: null },
      data: { loggedOutAt: new Date() }
    })
  }

  async disableAllSession(
    tx: PrismaClientTransaction
  ): Promise<Prisma.BatchPayload> {
    return await tx.session.updateMany({
      where: { loggedOutAt: null },
      data: { loggedOutAt: new Date() }
    })
  }
}
