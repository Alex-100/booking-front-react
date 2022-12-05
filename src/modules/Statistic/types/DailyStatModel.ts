import { DailyStatKeys } from '../../Dashboard/constants'

export interface DailyStatModel {
  [DailyStatKeys.bookingIn]: number
  [DailyStatKeys.bookingOut]: number
  [DailyStatKeys.totalPlaces]: number
  [DailyStatKeys.repairPlaces]: number
  [DailyStatKeys.placesAvailable]: number
  [DailyStatKeys.placesTaken]: number
  [DailyStatKeys.placesFree]: number
}
