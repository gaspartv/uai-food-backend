import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { isUUID } from 'class-validator'
import { randomUUID } from 'crypto'
import { PrismaClientTransaction } from '../../config/env/prisma/prisma.interface'
import { PrismaModule } from '../../config/env/prisma/prisma.module'
import { EnvService } from '../../config/env/service.env'
import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { CreateSessionDto } from './dto/create-session.dto'
import { SessionWithNotRelationsEntity } from './entities/session.entity'
import { SessionMemoryRepository } from './repositories/memory/sessions.memory.repository'
import { SessionRepository } from './repositories/sessions.repository'
import { SessionsService } from './sessions.service'

describe('SessionsService', () => {
  let sessionRepository: SessionRepository
  let service: SessionsService
  let usersService: UsersService
  let tx: PrismaClientTransaction

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UsersModule, ConfigModule],
      providers: [
        EnvService,
        SessionsService,
        { provide: SessionRepository, useClass: SessionMemoryRepository }
      ]
    }).compile()

    sessionRepository = module.get<SessionRepository>(SessionRepository)
    service = module.get<SessionsService>(SessionsService)
    usersService = module.get<UsersService>(UsersService)

    const findUserByIdOrThrow = jest.spyOn(usersService, 'findUserByIdOrThrow')
    findUserByIdOrThrow.mockImplementation()
  })

  afterAll(async () => {
    jest.restoreAllMocks()
  })

  it('should to be service defined', () => {
    expect(service).toBeDefined()
  })

  it('should to be usersService defined', () => {
    expect(usersService).toBeDefined()
  })

  it('should to create a session - createSession()', async () => {
    const userId = randomUUID()
    const data: CreateSessionDto = { userId }

    const session = await service.createSession(tx, data)

    expect(session instanceof SessionWithNotRelationsEntity).toBe(true)
    expect(session).toBeDefined()
    expect(session.id).toBeDefined()
    expect(session.loggedIn).toBeDefined()
    expect(session.loggedOutAt).toBeDefined()
    expect(session.userId).toBeDefined()

    expect(isUUID(session.id)).toBe(true)
    expect(isUUID(session.userId)).toBe(true)

    expect(session.loggedIn instanceof Date).toBe(true)
  })

  it('should to search a session by id - findSessionById()', async () => {
    const userId = randomUUID()
    const session = await service.createSession(tx, { userId })

    const findSession = await service.findSessionById(tx, session.id)

    expect(findSession instanceof SessionWithNotRelationsEntity).toBe(true)
    expect(findSession).toBeDefined()
    expect(findSession.id).toBeDefined()
    expect(findSession.loggedIn).toBeDefined()
    expect(findSession.loggedOutAt).toBeDefined()
    expect(findSession.userId).toBeDefined()

    expect(isUUID(findSession.id)).toBe(true)
    expect(isUUID(findSession.userId)).toBe(true)

    expect(findSession.loggedIn instanceof Date).toBe(true)
  })

  it('should to search all sessions by userId - findAllSessionByUser()', async () => {
    const userId = randomUUID()

    const promises: Promise<SessionWithNotRelationsEntity>[] = []

    for (let i = 0; i < 10; i++) {
      promises.push(sessionRepository.createSession(tx, { userId }))
    }

    await Promise.all(promises)

    const sessions = await service.findAllSessionByUser(tx, userId)

    expect(sessions).toBeDefined()
    expect(Array.isArray(sessions)).toBe(true)

    if (Array.isArray(sessions)) {
      sessions.forEach((session) => {
        expect(session instanceof SessionWithNotRelationsEntity).toBe(true)
        expect(session).toBeDefined()
        expect(session.id).toBeDefined()
        expect(session.loggedIn).toBeDefined()
        expect(session.loggedOutAt).toBeDefined()
        expect(session.userId).toBeDefined()

        expect(isUUID(session.id)).toBe(true)
        expect(isUUID(session.userId)).toBe(true)

        expect(session.loggedIn instanceof Date).toBe(true)
      })
    }
  })

  it('should to search all sessions - findAllSession()', async () => {
    const promises: Promise<SessionWithNotRelationsEntity>[] = []

    for (let i = 0; i < 32; i++) {
      promises.push(
        sessionRepository.createSession(tx, { userId: randomUUID() })
      )
    }

    await Promise.all(promises)

    const sessions = await service.findAllSession(tx)

    expect(sessions).toBeDefined()
    expect(Array.isArray(sessions)).toBe(true)

    if (Array.isArray(sessions)) {
      sessions.forEach((session) => {
        expect(session instanceof SessionWithNotRelationsEntity).toBe(true)
        expect(session).toBeDefined()
        expect(session.id).toBeDefined()
        expect(session.loggedIn).toBeDefined()
        expect(session.loggedOutAt).toBeDefined()
        expect(session.userId).toBeDefined()

        expect(isUUID(session.id)).toBe(true)
        expect(isUUID(session.userId)).toBe(true)

        expect(session.loggedIn instanceof Date).toBe(true)
      })
    }
  })

  it('should to disable a session by id - disableSessionById()', async () => {
    const userId = randomUUID()
    const session = await service.createSession(tx, { userId })

    const sessionDisabled = await service.disableSessionById(tx, session.id)

    expect(sessionDisabled instanceof SessionWithNotRelationsEntity).toBe(true)
    expect(sessionDisabled).toBeDefined()
    expect(sessionDisabled.id).toBeDefined()
    expect(sessionDisabled.loggedIn).toBeDefined()
    expect(sessionDisabled.loggedOutAt).toBeDefined()
    expect(sessionDisabled.userId).toBeDefined()

    expect(isUUID(sessionDisabled.id)).toBe(true)
    expect(isUUID(sessionDisabled.userId)).toBe(true)

    expect(sessionDisabled.loggedIn instanceof Date).toBe(true)
    expect(sessionDisabled.loggedOutAt instanceof Date).toBe(true)
  })

  it('should to be disabled all sessions by userId - disableAllSessionByUser()', async () => {
    const userId = randomUUID()

    const promises: Promise<SessionWithNotRelationsEntity>[] = []

    for (let i = 0; i < 8; i++) {
      promises.push(sessionRepository.createSession(tx, { userId }))
    }

    await Promise.all(promises)

    const sessions = await service.disableAllSessionByUser(tx, userId)

    expect(sessions).toBeDefined()
    expect(sessions.message).toBeDefined()
    expect(sessions.message).toEqual('All sessions disabled by userId.')
  })

  it('should to be disabled all sessions - disableAllSession()', async () => {
    const sessions = await service.disableAllSession(tx)

    expect(sessions).toBeDefined()
    expect(sessions.message).toBeDefined()
    expect(sessions.message).toEqual('All sessions disabled.')
  })

  it('should to search a session by id or throw - findSessionByIdOrThrow()', async () => {
    const userId = randomUUID()
    const session = await service.createSession(tx, { userId })

    const findSession = await service.findSessionByIdOrThrow(tx, session.id)

    expect(findSession instanceof SessionWithNotRelationsEntity).toBe(true)
    expect(findSession).toBeDefined()
    expect(findSession.id).toBeDefined()
    expect(findSession.loggedIn).toBeDefined()
    expect(findSession.loggedOutAt).toBeDefined()
    expect(findSession.userId).toBeDefined()

    expect(isUUID(findSession.id)).toBe(true)
    expect(isUUID(findSession.userId)).toBe(true)

    expect(findSession.loggedIn instanceof Date).toBe(true)
  })
})
