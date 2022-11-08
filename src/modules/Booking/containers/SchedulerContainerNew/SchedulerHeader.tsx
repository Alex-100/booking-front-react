import { TableCell, TableRow, Typography } from '@mui/material'
import isSameDay from 'date-fns/isSameDay'
import format from 'date-fns/format'
import isWeekend from 'date-fns/isWeekend'
import { useTranslation } from 'react-i18next'
import { GroupedDaysList } from './interfaces'

interface SchedulerHeaderProps {
  groupedDays: GroupedDaysList
  dates: Array<Date>
  currentDate: Date
  locale: Locale
}

export const SchedulerHeader = ({
  groupedDays,
  dates,
  currentDate,
  locale,
}: SchedulerHeaderProps) => {
  const { t } = useTranslation()
  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            minWidth: 140,
            borderRight: 1,
            borderTop: 1,
            borderColor: 'divider',
            position: 'sticky',
            zIndex: 210,
            left: 0,
            background: 'white',
            borderBottom: 'none',
          }}
        ></TableCell>
        {groupedDays.map((item, idx) => (
          <TableCell
            key={idx}
            colSpan={item.days.length}
            sx={{
              borderRight: 1,
              borderTop: 1,
              borderColor: 'divider',
              width: 64,
              textAlign: 'center',
              background: 'white',
              zIndex: 100,
              borderBottom: 'none',
            }}
          >
            {item.month}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell
          sx={{
            minWidth: 140,
            maxWidth: 180,
            borderRight: 1,
            borderTop: 1,
            borderColor: 'divider',
            position: 'sticky',
            zIndex: 220,
            left: 0,
            background: 'white',
          }}
        >
          {t('Room')}
        </TableCell>
        {dates.map((date, idx) => (
          <TableCell
            key={idx}
            sx={{
              borderRight: 1,
              borderTop: 1,
              borderColor: 'divider',
              minWidth: 48,
              width: 48,
              maxWidth: 48,
              p: 0,
              pt: 0.5,
              pb: 0.5,
              textAlign: 'center',
              zIndex: 100,
              ...(isWeekend(date) && { bgcolor: '#fdeaea' }),
              ...(isSameDay(date, currentDate) && {
                bgcolor: '#e3eefa',
              }),
            }}
          >
            {format(date, 'd')}
            <br />
            <Typography variant="caption">
              {format(date, 'EEEEEE', { locale })}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </>
  )
}
