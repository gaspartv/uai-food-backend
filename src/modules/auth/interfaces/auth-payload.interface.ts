export interface IPayload {
  iat?: number
  exp?: number
  sign: ISign
}

interface ISign {
  sub: string
}
