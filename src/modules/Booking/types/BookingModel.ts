import { CompanyModel } from '../../Company/CompanyModel'
import { PlaceModel } from '../../Room/types'
import { UserModel } from '../../User/UserModel'
import { ComboRateModel } from '../../Rate/types'
import {
  SourceFundingEnum,
  StatusOfBookingEnum,
  TypeOfBookingEnum,
} from './enums'

export interface BookingModel {
  id: number
  typeOfBooking: TypeOfBookingEnum
  statusOfBooking: StatusOfBookingEnum
  individualId: string
  groupBookingId: string
  sourceFunding: SourceFundingEnum
  enteringDate: string // '2022-09-02T17:05:04.101Z'
  leavingDate: string // '2022-09-02T17:05:04.101Z'
  name: string
  patronymicName: string
  surname: string
  dob: string // '2022-11-01'
  phoneNumber: string
  email: string
  note: string
  sentByCompany: CompanyModel
  place: PlaceModel
  appUser: UserModel
  comboRate: ComboRateModel
  gender?: string
}

export interface BookingCreateForm {
  placeId: number
  userId: number
  comboRateId: number
  typeOfBooking: TypeOfBookingEnum
  statusOfBooking: StatusOfBookingEnum
  individualId: string
  sourceFunding: SourceFundingEnum
  enteringDate: string // 'YYYY-MM-DD HH:mm'
  leavingDate: string // 'YYYY-MM-DD HH:mm'
  enteringDateD: string
  enteringTime: string
  leavingDateD: string
  leavingTime: string
}
