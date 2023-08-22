import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class UpdateSessionDto {
  @IsOptional()
  @IsDate()
  expiresAt: Date

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens?: string[]
}
