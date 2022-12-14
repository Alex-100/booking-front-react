import React, { useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { DateRange, DateRangePicker, DefinedRange } from 'mui-daterange-picker'

import { ru, enUS } from 'date-fns/locale'

import { useAppDispatch, useAppSelector } from '../../../../store'
import { DATE_FORMAT_TEMPLATE } from '../../../../constants'
import { setDateRange } from '../../state/bookingFiltersSlice'
import { useTranslation } from 'react-i18next'
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import i18n from './../../../../i18n'
import parseISO from 'date-fns/parseISO'

const getDateRanges = (date: Date, locale: Locale): DefinedRange[] => [
  {
    label: i18n.t('Today'),
    startDate: date,
    endDate: date,
  },
  {
    label: i18n.t('Yesterday'),
    startDate: addDays(date, -1),
    endDate: addDays(date, -1),
  },
  {
    label: i18n.t('This Week'),
    startDate: startOfWeek(date, { locale }),
    endDate: endOfWeek(date, { locale }),
  },
  {
    label: i18n.t('Last Week'),
    startDate: startOfWeek(addWeeks(date, -1), { locale }),
    endDate: endOfWeek(addWeeks(date, -1), { locale }),
  },
  {
    label: i18n.t('Last 7 Days'),
    startDate: addWeeks(date, -1),
    endDate: date,
  },
  {
    label: i18n.t('This Month'),
    startDate: startOfMonth(date),
    endDate: endOfMonth(date),
  },
  {
    label: i18n.t('Last Month'),
    startDate: startOfMonth(addMonths(date, -1)),
    endDate: endOfMonth(addMonths(date, -1)),
  },
  // {
  //   label: i18n.t('This Year'),
  //   startDate: startOfYear(date),
  //   endDate: endOfYear(date),
  // },
  // {
  //   label: i18n.t('Last Year'),
  //   startDate: startOfYear(addYears(date, -1)),
  //   endDate: endOfYear(addYears(date, -1)),
  // },
]

const DateRangeContainer: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const handleToggle = () => setOpen(!open)
  const { t } = useTranslation()

  const locale = useMemo(() => (i18n.language === 'ru' ? ru : enUS), [
    i18n.language,
  ])
  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  const dispatch = useAppDispatch()

  const handleChangeDateRange = (range: DateRange) => {
    dispatch(
      setDateRange({
        startDate: dayjs(range.startDate).format(DATE_FORMAT_TEMPLATE),
        endDate: dayjs(range.endDate).format(DATE_FORMAT_TEMPLATE),
      })
    )
  }

  const initialDateRangeComputed: DateRange = {
    startDate: dayjs(bookingFilters.from).toDate(),
    endDate: dayjs(bookingFilters.to).toDate(),
  }

  const dateRanges = useMemo(() => getDateRanges(new Date(), locale), [locale])

  useEffect(() => {
    console.log(
      bookingFilters.from,
      bookingFilters.to,
      parseISO(bookingFilters.from),
      parseISO(bookingFilters.to)
    )
    console.log(
      addMonths(parseISO(bookingFilters.to), 2),
      addMonths(parseISO(bookingFilters.from), -2)
    )
  }, [bookingFilters.from, bookingFilters.to])

  return (
    <Box sx={{ position: 'relative', minWidth: 200 }}>
      <Stack spacing={2} direction="row">
        <TextField
          label={t('From')}
          variant="outlined"
          onFocus={handleToggle}
          value={dayjs(bookingFilters.from).format('YYYY-MM-DD')}
          size="small"
        />
        <TextField
          label={t('To')}
          variant="outlined"
          onFocus={handleToggle}
          value={dayjs(bookingFilters.to).format('YYYY-MM-DD')}
          size="small"
        />
      </Stack>
      {open && (
        <Box sx={{ position: 'absolute', right: 0 }}>
          <Box sx={{ position: 'relative', zIndex: 10000 }}>
            <DateRangePicker
              open={open}
              definedRanges={dateRanges}
              initialDateRange={initialDateRangeComputed}
              toggle={handleToggle}
              onChange={handleChangeDateRange}
              locale={locale}
              minDate={addMonths(parseISO(bookingFilters.to), -2)}
              maxDate={addMonths(parseISO(bookingFilters.from), 2)}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DateRangeContainer
