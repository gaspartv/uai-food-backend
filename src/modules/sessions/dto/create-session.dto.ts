import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class CreateSessionDto {
  @IsString()
  userId: string

  @IsDate()
  expiresAt: Date

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens?: string[]
}
