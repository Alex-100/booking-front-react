import type { PaginationParams } from '../../../types'
import {
  SourceFundingEnum,
  StatusOfBookingEnum,
  TypeOfBookingEnum,
} from './enums'

export interface BookingSearchParams extends PaginationParams {
  from: string // 2022-06-30 14:30
  to: string // 2022-06-30 14:30
  departmentId?: number
  hospitalId?: number
  labelId?: number
  sourceFunding?: SourceFundingEnum
  typeOfBooking?: TypeOfBookingEnum
  statusOfBooking?: StatusOfBookingEnum
  test?: string
  search?: string
}
