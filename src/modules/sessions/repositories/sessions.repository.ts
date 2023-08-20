import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../config/env/prisma/prisma.interface'
import { SessionWithNotRelationsEntity } from '../entities/session.entity'

export abstract class SessionRepository {
  abstract createSession(
    tx: PrismaClientTransaction,
    data: Prisma.SessionUncheckedCreateInput
  ): Promise<SessionWithNotRelationsEntity>

  abstract updateSession(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.SessionUncheckedUpdateInput
  ): Promise<SessionWithNotRelationsEntity>

  abstract findSessionById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity>

  abstract findAllSessionByUser(
    tx: PrismaClientTransaction,
    userId: string
  ): Promise<SessionWithNotRelationsEntity[]>

  abstract findAllSession(
    tx: PrismaClientTransaction
  ): Promise<SessionWithNotRelationsEntity[]>

  abstract disableSessionById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<SessionWithNotRelationsEntity>

  abstract disableAllSessionByUser(
    tx: PrismaClientTransaction,
    userId: string
  ): Promise<Prisma.BatchPayload>

  abstract disableAllSession(
    tx: PrismaClientTransaction
  ): Promise<Prisma.BatchPayload>
}
