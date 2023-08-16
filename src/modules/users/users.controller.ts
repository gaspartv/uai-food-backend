import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { IOptionsFindMany } from '../../common/interfaces/options-repository.interface'
import { OptionalParseBollPipe } from '../../common/pipes/optional-parse-boolean.pipe'
import { OptionalParseIntPipe } from '../../common/pipes/optional-parse-int.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './entities/user.entity'
import { UserResponseMapper } from './mappers/user.response.mapper'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.prisma.$transaction(async (tx) => {
      return await this.usersService.create(tx, createUserDto)
    })

    return plainToInstance(UserEntity, user)
  }

  @Get()
  async findAllPagination(
    @Query('disabled', new OptionalParseBollPipe())
    disabledAt: boolean | undefined,
    @Query('skip', new OptionalParseIntPipe()) skip = 0,
    @Query('take', new OptionalParseIntPipe()) take = 20
  ) {
    const users = await this.prisma.$transaction(async (tx) => {
      const options: IOptionsFindMany = {
        disabledAt,
        skip,
        take
      }

      return await this.usersService.findAllPagination(tx, options)
    })

    const results = new UserResponseMapper().handle(users)

    return {
      limit: take,
      page: skip,
      total: results.length,
      next: '',
      previous: '',
      results
    }
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const user = await this.prisma.$transaction(async (tx) => {
  //     return await this.usersService.findOne(tx, id)
  //   })

  //   return plainToInstance(UserEntity, user)
  // }

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
