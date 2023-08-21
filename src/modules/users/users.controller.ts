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
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.createUser(tx, dto)
    })
    return new UserResponseMapper().handle(user)
  }

  @Get()
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

  @Get(':id')
  async findOne(
    @Query('disabled', new OptionalParseBollPipe())
    disabledAt: boolean | undefined,
    @Query('deleted', new OptionalParseBollPipe())
    deletedAt: boolean | undefined,
    @Param('id', new ParseUuidPipe()) id: string
  ) {
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
  @Patch(':id')
  async updateUserById(
    @Param('id') id: any,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.updateUserById(tx, id, updateUserDto)
    })

    return plainToInstance(UserEntity, user)
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   const user = await this.prisma.$transaction(async (tx) => {
  //     return await this.usersService.delete(tx, id)
  //   })

  //   return plainToInstance(UserEntity, user)
  // }
}
