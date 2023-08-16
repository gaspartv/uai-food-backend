import { Injectable } from '@nestjs/common'
import { UserEntity } from '../entities/user.entity'

@Injectable()
export class UserResponseMapper {
  handle(users: UserEntity[]) {
    return users.map((user) => {
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
        dark_mode: user.dark_mode,
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
          zip_code: user.Address.zip_code,
          complement: user.Address.complement
        },
        Purchases: user.Purchases,
        Stars: user.Stars,
        StorePermissions: user.StorePermissions
      }
    })
  }
}
