import { useTranslation } from 'react-i18next'
import {
  SourceFundingEnum,
  StatusOfBookingEnum,
  TypeOfBookingEnum,
} from '../types/enums'

export const sourceFundingOptionsFn = () => {
  const { t } = useTranslation()
  const data: [SourceFundingEnum, string][] = [
    [SourceFundingEnum.PUBLIC_INSURANCE, t('PUBLIC_INSURANCE')],
    [SourceFundingEnum.PRIVATE_INSURANCE, t('PRIVATE_INSURANCE')],
    [SourceFundingEnum.PAID_BY_CITIZENS, t('PAID_BY_CITIZENS')],
    [SourceFundingEnum.PAID_BY_COMPANY, t('PAID_BY_COMPANY')],
    [SourceFundingEnum.CHARITY, t('CHARITY')],
    [SourceFundingEnum.BUDGET_FEDERAL, t('BUDGET_FEDERAL')],
    [SourceFundingEnum.BUDGET_REGION, t('BUDGET_REGION')],
    [SourceFundingEnum.BUDGET_DISTRICT, t('BUDGET_DISTRICT')],
    [SourceFundingEnum.COLLECTIVE_FUNDING_FSS, t('COLLECTIVE_FUNDING_FSS')],
    [SourceFundingEnum.OTHER, t('OTHER')],
  ]
  return data
}

export const typeOfBookingOptionsFn = (): [TypeOfBookingEnum, string][] => {
  const { t } = useTranslation()
  return [
    [TypeOfBookingEnum.INDIVIDUAL, t('INDIVIDUAL')],
    [TypeOfBookingEnum.REPAIR, t('REPAIR')],
    [TypeOfBookingEnum.GROUP, t('GROUP')],
    [TypeOfBookingEnum.INTERNET_WEB, t('INTERNET_WEB')],
    [TypeOfBookingEnum.INTERNET_CHATBOT, t('INTERNET_CHATBOT')],
  ]
}

// export const typeOfBookingOptions: [TypeOfBookingEnum, string][] = [
//   [TypeOfBookingEnum.INDIVIDUAL, 'INDIVIDUAL'],
//   [TypeOfBookingEnum.REPAIR, 'REPAIR'],
//   [TypeOfBookingEnum.GROUP, 'GROUP'],
//   [TypeOfBookingEnum.INTERNET_WEB, 'INTERNET_WEB'],
//   [TypeOfBookingEnum.INTERNET_CHATBOT, 'INTERNET_CHATBOT'],
// ]

export const statusOfBookingOptionsFn = (): [StatusOfBookingEnum, string][] => {
  const { t } = useTranslation()
  return [
    [StatusOfBookingEnum.BOOKED, t('BOOKED')],
    [StatusOfBookingEnum.ENTERED, t('ENTERED')],
    [StatusOfBookingEnum.LEFT, t('LEFT')],
    [StatusOfBookingEnum.AWAITING_ENTERING, t('AWAITING_ENTERING')],
    [StatusOfBookingEnum.AWAITING_LEAVING, t('AWAITING_LEAVING')],
    [StatusOfBookingEnum.AWAITING_BOOKING, t('AWAITING_BOOKING')],
  ]
}

export const DAYS_INCREMENT_OPTIONS = [10, 12, 14, 16, 18, 20]
