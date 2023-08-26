import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/config/prisma/prisma.service'
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto'
import { ResponseUserDto } from '../src/modules/users/dto/response-user.dto'

describe('Users Controller (e2e)', () => {
  let app: NestFastifyApplication
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    prisma = new PrismaService()
  })

  it('should to create a new user - (POST) /users', async () => {
    const dataUser: CreateUserDto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test_user_create@mail.com',
      login: 'test_user_create',
      phone: '32998111111',
      password: '12345',
      dark_mode: false,
      language: 'PT_BR',
      description: 'Test create new user',
      address: {
        street: 'Rua test create new user',
        addressNumber: '1111',
        country: 'Brasil',
        city: 'Rio de Janeiro',
        state: 'RJ',
        province: 'Realengo',
        zip_code: '21111-111',
        complement: 'ap 111'
      }
    }

    const { body }: { body: ResponseUserDto } = await request(
      app.getHttpServer()
    )
      .post('/users')
      .send(dataUser)
      .expect(201)

    expect(body).toBeDefined()
    expect(body.id).toBeDefined()
    expect(body.balance).toBeDefined()
    expect(body.nivel).toBeDefined()
    expect(body.experience).toBeDefined()
    expect(body.firstName).toBeDefined()
    expect(body.lastName).toBeDefined()
    expect(body.description).toBeDefined()
    expect(body.email).toBeDefined()
    expect(body.phone).toBeDefined()
    expect(body.imageUri).toBeDefined()
    expect(body.dark_mode).toBeDefined()
    expect(body.language).toBeDefined()
    expect(body.createdAt).toBeDefined()
    expect(body.updatedAt).toBeDefined()
    expect(body.disabledAt).toBeDefined()
    expect(body.Address).toBeDefined()
    expect(body.Purchases).toBeDefined()
    expect(body.Assessments).toBeDefined()
    expect(body.Permissions).toBeDefined()

    expect(body).toMatchObject({
      id: body.id,
      balance: 0,
      nivel: 1,
      experience: 0,
      firstName: 'Test',
      lastName: 'User',
      description: 'Test create new user',
      email: 'test_user_create@mail.com',
      phone: '32998111111',
      imageUri: null,
      dark_mode: false,
      language: 'PT_BR',
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      disabledAt: null,
      Address: {
        id: body.Address.id,
        street: 'Rua test create new user',
        addressNumber: '1111',
        country: 'Brasil',
        city: 'Rio de Janeiro',
        state: 'RJ',
        province: 'Realengo',
        zip_code: '21111-111',
        complement: 'ap 111'
      },
      Purchases: [],
      Assessments: [],
      Permissions: [],
      Conversations: []
    })

    expect({
      id: body.id,
      balance: 0,
      nivel: 1,
      experience: 0,
      firstName: 'Test',
      lastName: 'User',
      description: 'Test create new user',
      email: 'test_user_create@mail.com',
      phone: '32998111111',
      imageUri: null,
      dark_mode: false,
      language: 'PT_BR',
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      disabledAt: null,
      Address: {
        id: body.Address.id,
        street: 'Rua test create new user',
        addressNumber: '1111',
        country: 'Brasil',
        city: 'Rio de Janeiro',
        state: 'RJ',
        province: 'Realengo',
        zip_code: '21111-111',
        complement: 'ap 111'
      },
      Purchases: [],
      Assessments: [],
      Permissions: [],
      Conversations: []
    }).toMatchObject(body)
  })
})
