import ru from 'date-fns/locale/ru'
import en from 'date-fns/locale/en-US'
import format from 'date-fns/format'
import { GroupedDaysList } from './interfaces'

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


export const normalize = () => {
  
}
