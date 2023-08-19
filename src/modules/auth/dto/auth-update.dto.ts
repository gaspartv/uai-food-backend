import { PartialType } from '@nestjs/swagger'
import { CreateAuthDto } from './auth-create.dto'

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
