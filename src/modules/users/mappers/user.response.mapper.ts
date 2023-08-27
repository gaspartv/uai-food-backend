import { Injectable } from '@nestjs/common'
import { ResponseUserDto } from '../dto/response-user.dto'
import { UserEntity } from '../entities/user.entity'

@Injectable()
export class UserResponseMapper {
  handle(user: UserEntity): ResponseUserDto {
    return {
      id: user.id,
      balance: user.balance,
      nivel: user.nivel,
      experience: user.experience,
      firstName: user.firstName,
      lastName: user.lastName,
      description: user.description,
      email: user.email,
      phone: user.phone,
      imageUri: user.imageUri,
      darkMode: user.darkMode,
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      disabledAt: user.disabledAt,
      Address: {
        id: user.Address.id,
        street: user.Address.street,
        addressNumber: user.Address.addressNumber,
        country: user.Address.country,
        city: user.Address.city,
        state: user.Address.state,
        province: user.Address.province,
        zipCode: user.Address.zipCode,
        complement: user.Address.complement
      },
      Purchases: user.Purchases,
      Permissions: user.Permissions,
      Assessments: user.Assessments,
      Conversations: user.Conversations
    }
  }
}
