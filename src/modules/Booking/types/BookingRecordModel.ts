import { PlaceModel, RoomModel } from '../../Room/types'
import { BookingModel } from './BookingModel'

export interface BookingPlace extends PlaceModel {
  bookings: BookingModel[]
}

export interface BookingRecordModel extends RoomModel {
  places: BookingPlace[]
}
