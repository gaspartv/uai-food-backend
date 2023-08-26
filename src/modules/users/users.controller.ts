import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { CheckPassword } from '../../common/decorators/check-password.decorator'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { Sign } from '../../common/decorators/sign.decorator'
import { CheckPasswordDto } from '../../common/dto/check-password.dto'
import { MessageDto } from '../../common/dto/message.dto'
import { ISign } from '../../common/interfaces/payload.interface'
import { OptionalParseBollPipe } from '../../common/pipes/optional-parse-boolean.pipe'
import { OptionalParseIntPipe } from '../../common/pipes/optional-parse-int.pipe'
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe'
import { EnvService } from '../../config/env/service.env'
import { CreateUserDto } from './dto/create-user.dto'
import {
  ResponseUserDto,
  ResponseUserPaginationDto
} from './dto/response-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from './interfaces/options.interface'
import { UserResponseMapper } from './mappers/user.response.mapper'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly usersService: UsersService,
    private readonly envService: EnvService
  ) {}

  @IsPublic()
  @Post('create')
  async createUser(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.createUser(tx, dto)
    })
    return new UserResponseMapper().handle(user)
  }

  @CheckPassword()
  @Patch(':id/edit')
  async updateUserById(
    @Sign() sign: ISign,
    @Param('id') id: any,
    @Body() dto: UpdateUserDto
  ): Promise<ResponseUserDto> {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.updateUserById(tx, id, sign.sub, dto)
    })

    return plainToInstance(UserEntity, user)
  }

  @Get('all')
  async findAllUsersForPagination(
    @Query('disabled', new OptionalParseBollPipe())
    disabledAt: boolean | undefined,
    @Query('deleted', new OptionalParseBollPipe())
    deletedAt: boolean | undefined,
    @Query('skip', new OptionalParseIntPipe()) skip = 0,
    @Query('take', new OptionalParseIntPipe()) take = 20
  ): Promise<ResponseUserPaginationDto> {
    const options: IPaginationOptions = {
      disabledAt,
      deletedAt,
      skip,
      take
    }

    const users = await this.usersService.findAllUsersForPagination(
      this.prisma,
      options
    )

    const usersCount = await this.usersService.countUsers(this.prisma, options)

    const results = users.map((user) => new UserResponseMapper().handle(user))

    return {
      limit: take,
      page: skip,
      total: usersCount,
      next:
        skip < usersCount - take
          ? this.envService.env.BACKEND_URL +
            `/users?skip${skip + 1}&take=${take}&disabled=${disabledAt}`
          : null,
      previous:
        skip > 0
          ? this.envService.env.BACKEND_URL +
            `/users?skip${skip - 1}&take=${take}&disabled=${disabledAt}`
          : null,
      results
    }
  }

  @Get(':id/find')
  async findOne(
    @Query('disabled', new OptionalParseBollPipe())
    disabledAt: boolean | undefined,
    @Query('deleted', new OptionalParseBollPipe())
    deletedAt: boolean | undefined,
    @Param('id', new ParseUuidPipe()) id: string
  ): Promise<ResponseUserDto> {
    const options: IFindOptions = {
      disabledAt,
      deletedAt
    }

    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.findUserByIdOrThrow(tx, id, options)
    })
    return new UserResponseMapper().handle(user)
  }

  @CheckPassword()
  @Patch(':id/enable')
  async enableUserById(
    @Param('id') id: string,
    @Sign() sign: ISign,
    @Body() _: CheckPasswordDto
  ): Promise<ResponseUserDto> {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.enableUserById(tx, id, sign.sub)
    })

    return new UserResponseMapper().handle(user)
  }

  @CheckPassword()
  @Patch(':id/disable')
  async disableUserById(
    @Param('id') id: string,
    @Sign() sign: ISign,
    @Body() _: CheckPasswordDto
  ): Promise<ResponseUserDto> {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.disableUserById(tx, id, sign.sub)
    })

    return new UserResponseMapper().handle(user)
  }

  @CheckPassword()
  @Patch(':id/delete')
  async deleteUserById(
    @Param('id') id: string,
    @Sign() sign: ISign,
    @Body() _: CheckPasswordDto
  ): Promise<MessageDto> {
    await this.prisma.$transaction(async (tx) => {
      return await this.usersService.deleteUserById(tx, id, sign.sub)
    })

    return { message: 'Successfully deleted user.' }
  }
}
