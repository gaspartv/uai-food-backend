import { IFindOptions } from '../modules/users/interfaces/options.interface'

export function filterOptions(arr: any[], options: IFindOptions) {
  return arr.filter((user) => {
    if (options.deletedAt === undefined && options.disabledAt === undefined) {
      return true
    }

    const isDeletedAtDate = user.deletedAt instanceof Date
    const isDisabledAtDate = user.disabledAt instanceof Date
    const isDeletedAtNull = user.deletedAt === null
    const isDisabledAtNull = user.disabledAt === null

    if (options.deletedAt === undefined) {
      if (options.disabledAt === true) {
        return isDisabledAtDate
      } else if (options.disabledAt === false) {
        return isDisabledAtNull
      }
    } else if (options.deletedAt === true) {
      if (options.disabledAt === undefined) {
        return isDeletedAtDate
      } else if (options.disabledAt === true) {
        return isDeletedAtDate && isDisabledAtDate
      } else if (options.disabledAt === false) {
        return isDeletedAtDate && isDisabledAtNull
      }
    } else if (options.deletedAt === false) {
      if (options.disabledAt === undefined) {
        return isDeletedAtNull
      } else if (options.disabledAt === true) {
        return isDeletedAtNull && isDisabledAtDate
      } else if (options.disabledAt === false) {
        return isDeletedAtNull && isDisabledAtNull
      }
    }

    return false
  })
}
