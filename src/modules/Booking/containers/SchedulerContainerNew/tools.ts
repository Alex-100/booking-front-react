import ru from 'date-fns/locale/ru'
import en from 'date-fns/locale/en-US'
import format from 'date-fns/format'
import {
  GroupedDaysList,
  SchedulerPlaceRowData,
  SchedulerRowsData,
  SchedulerRowInfo,
} from './interfaces'
import { BookingRecordModel } from 'modules/Booking/types'

export const getDateLocale = (lc: string) => {
  if (lc === 'ru') return ru
  else return en
}

export const groupByMonth = (dates: Array<Date>, locale: Locale) =>
  dates.reduce<GroupedDaysList>((acc, date) => {
    const monthForDate = format(date, 'LLLL', { locale })
    const idx = acc.findIndex(({ month }) => month === monthForDate)
    const data: GroupedDaysList = Array.from(acc)
    if (idx >= 0) {
      const [exist] = data.splice(idx, 1)
      data.splice(idx, 0, { ...exist, days: [...exist.days, date] })
    } else {
      data.push({ month: monthForDate, days: [date] })
    }
    return data
  }, [])

export const normalizeSchedulerData = (
  data: Array<BookingRecordModel>,
  collapsed: Array<number>
): SchedulerRowsData => {
  let curDep: number = 0

  const normalize = data.reduce<SchedulerRowsData>((acc, item) => {
    const tmp: SchedulerRowsData = Array.from(acc)

    if (curDep !== item.department.id) {
      curDep = item.department.id
      const dep: SchedulerRowInfo = {
        type: 'department',
        id: item.department.id,
        departmentName: item.department.name,
        hospitalName: item.department.hospital.name,
      }
      tmp.push(dep)
    }

    const room: SchedulerRowInfo = {
      type: 'room',
      id: item.id,
      capacity: item.capacity,
      label: item.label,
      room: item.roomNumber,
    }
    tmp.push(room)

    if (!collapsed.includes(item.id)) {
      const placesInfo: Array<SchedulerPlaceRowData> = item.places.map(
        (place) => ({
          type: 'place',
          place,
        })
      )
      tmp.push(...placesInfo)
    }

    return tmp
  }, [])

  return normalize
}
