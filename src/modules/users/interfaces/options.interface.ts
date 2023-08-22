export interface IPaginationOptions {
  disabledAt: boolean | undefined
  deletedAt: boolean | undefined
  skip: number
  take: number
}

export interface IFindOptions {
  disabledAt: boolean | undefined
  deletedAt: boolean | undefined
}
