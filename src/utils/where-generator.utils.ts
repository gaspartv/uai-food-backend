export function whereGenerator(options: {
  disabledAt: boolean | undefined
  deletedAt: boolean | undefined
}) {
  const disabledAt =
    options.disabledAt === true
      ? { NOT: { disabledAt: null } }
      : options.disabledAt === false
      ? { disabledAt: null }
      : { disabledAt: undefined }

  const deletedAt =
    options.deletedAt === true
      ? { NOT: { deletedAt: null } }
      : options.deletedAt === false
      ? { deletedAt: null }
      : { deletedAt: undefined }

  return { ...disabledAt, ...deletedAt }
}
