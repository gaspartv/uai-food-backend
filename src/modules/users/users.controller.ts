import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { OptionalParseBollPipe } from '../../common/pipes/optional-parse-boolean.pipe'
import { OptionalParseIntPipe } from '../../common/pipes/optional-parse-int.pipe'
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe'
import { EnvService } from '../../config/env/service.env'
import { CreateUserDto } from './dto/create-user.dto'
import {
  ResponseUserDto,
  ResponseUserPaginationDto
} from './dto/response-user.dto'
import { IOptionsFindMany } from './interfaces/options.interface'
import { UserResponseMapper } from './mappers/user.response.mapper'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly usersService: UsersService,
    private readonly envService: EnvService
  ) {}

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
    @Query('skip', new OptionalParseIntPipe()) skip = 0,
    @Query('take', new OptionalParseIntPipe()) take = 20
  ): Promise<ResponseUserPaginationDto> {
    const options: IOptionsFindMany = {
      disabledAt,
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
        options.skip < usersCount - options.take
          ? this.envService.env.BACKEND_URL +
            `/users?skip${options.skip + 1}&take=${
              options.take
            }&disabled=${disabledAt}`
          : null,
      previous:
        options.skip > 0
          ? this.envService.env.BACKEND_URL +
            `/users?skip${options.skip - 1}&take=${
              options.take
            }&disabled=${disabledAt}`
          : null,
      results
    }
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUuidPipe()) id: string) {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.findUserByIdOrThrow(tx, id)
    })
    return new UserResponseMapper().handle(user)
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   const user = await this.prisma.$transaction(async (tx) => {
  //     return await this.usersService.update(tx, id, updateUserDto)
  //   })

  //   return plainToInstance(UserEntity, user)
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   const user = await this.prisma.$transaction(async (tx) => {
  //     return await this.usersService.delete(tx, id)
  //   })

  //   return plainToInstance(UserEntity, user)
  // }
}
