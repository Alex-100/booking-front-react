import i18n from './../i18n'

const required = (value: string | number) =>
  value || typeof value === 'number' ? undefined : i18n.t('Required')

const maxLength = (max: number) => (value: string) =>
  value && value.length > max
    ? i18n.t(`Must be {{max}} characters or less`, { max })
    : undefined

const minLength = (min: number) => (value: string) =>
  value && value.length < min
    ? i18n.t(`Must be {{min}} characters or more`, { min })
    : undefined

const number = (value: string | number) =>
  value && isNaN(Number(value)) ? i18n.t('Must be a number') : undefined

const minValue = (min: number) => (value: number) =>
  value && value < min ? i18n.t(`Must be at least {{min}}`, { min }) : undefined

const maxValue = (max: number) => (value: number) =>
  value && value > max ? i18n.t(`Must be not more {{max}}`, { max }) : undefined

const isLettersAndNumber = (value: string) =>
  value && !/^\w+$/.test(value)
    ? i18n.t('Must contain only letters and numbers')
    : undefined

const isTime = (value: string) =>
  value && !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(value)
    ? i18n.t('Invalid time')
    : undefined

const isDate = (value: string) =>
  value && !/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(value)
    ? i18n.t('Invalid date')
    : undefined

const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? i18n.t('Invalid email address')
    : undefined

const password = (value: string) =>
  value && !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/i.test(value)
    ? i18n.t('Invalid password')
    : undefined

const passwordConfirm = (values: {
  password: string
  passwordConfirm: string
}) => {
  const errors: { passwordConfirm?: string } = {}

  if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = i18n.t('Password mismatched')
  }

  return errors
}

export const validators = {
  required,
  maxLength,
  minLength,
  number,
  minValue,
  maxValue,
  email,
  password,
  passwordConfirm,
  isTime,
  isDate,
  isLettersAndNumber,
}
