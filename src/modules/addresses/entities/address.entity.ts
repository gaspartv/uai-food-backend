export class AddressWithNotRelationsEntity {
  id: string
  street: string
  addressNumber: string
  country: string
  city: string
  state: string
  province: string
  zip_code: string
  complement?: string
}

export class AddressEntity extends AddressWithNotRelationsEntity {}
