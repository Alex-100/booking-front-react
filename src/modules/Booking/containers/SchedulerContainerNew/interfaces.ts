import { BookingRecordModel } from 'modules/Booking/types'
import { DepartmentModel } from 'types'

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
export interface DepartmentRowProps {
  type: 'department'
  departmentName: string
  hospitalName: string
  datesCount: number
}
