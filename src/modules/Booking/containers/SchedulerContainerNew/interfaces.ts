import { BookingRecordModel } from 'modules/Booking/types'
import { DepartmentModel, LabelModel } from 'types'
import { BookingPlace } from 'modules/Booking/types/BookingRecordModel'

export interface GroupedDays {
  month: string
  days: Array<Date>
}
export type GroupedDaysList = Array<GroupedDays>

export type GroupByDepartment = {
  department: DepartmentModel
  rooms: BookingRecordModel[]
}

export type RowType = 'department' | 'room' | 'place'
export interface SchedulerDepartmentRowData {
  type: 'department'
  id: number
  departmentName: string
  hospitalName: string
}

export interface SchedulerPlaceRowData {
  type: 'place'
  place: BookingPlace
}

export interface SchedulerRoomsRowData {
  type: 'room'
  id: number
  room: number
  capacity: number
  label: LabelModel
}

export type SchedulerRowInfo =
  | SchedulerDepartmentRowData
  | SchedulerRoomsRowData
  | SchedulerPlaceRowData

export type SchedulerRowsData = Array<SchedulerRowInfo>
