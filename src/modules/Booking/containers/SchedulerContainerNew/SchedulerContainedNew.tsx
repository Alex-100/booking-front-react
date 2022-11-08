import { Box, TableHead, TableRow, useMediaQuery } from '@mui/material'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import parseISO from 'date-fns/parseISO'
import { useSearchQuery } from 'modules/Booking/state/bookingService'
import { useCallback, useMemo, useState } from 'react'
import { useAppSelector } from 'store'
import { useTranslation } from 'react-i18next'
import { getDateLocale, groupByMonth, normalizeSchedulerData } from './tools'
import { GroupedDaysList } from './interfaces'
import { SchedulerHeader } from './SchedulerHeader'
import { DepartmentRow } from './DepartmentRow'
import { TableVirtuoso } from 'react-virtuoso'
import { SchedulerRoomsRow } from './SchedulerRoomsRow'
import { SchedulerPlaceRow } from './SchedulerPlaceRow'

interface SchedulerContainedNewProps {
  filterHeight: number
}

export const SchedulerContainedNew = ({
  filterHeight,
}: SchedulerContainedNewProps) => {
  const matchesSm = useMediaQuery((theme: any) => theme.breakpoints.up('sm'))
  const widthMax700 = useMediaQuery('(max-width:700px)')

  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  const { data, status } = useSearchQuery(bookingFilters)
  const { i18n } = useTranslation()
  const locale = useMemo(() => getDateLocale(i18n.language), [i18n.language])

  const [collapsed, setCollapsed] = useState<Array<number>>([])
  const toggleCollapse = useCallback(
    (roomId: number) => {
      const tmp = Array.from(collapsed)
      const findedIndex = tmp.findIndex((item) => item === roomId)
      if (findedIndex >= 0) {
        tmp.splice(findedIndex, 1)
      } else {
        tmp.push(roomId)
      }
      setCollapsed(tmp)
    },
    [collapsed]
  )

  const collapsedRooms = useMemo(() => collapsed, [collapsed])

  const normalizedPlaces = useMemo(
    () =>
      normalizeSchedulerData(
        data !== undefined ? data.content : [],
        collapsedRooms
      ),
    [data, collapsedRooms]
  )

  const dates = useMemo(
    () =>
      eachDayOfInterval({
        start: parseISO(bookingFilters.from),
        end: parseISO(bookingFilters.to),
      }),
    [bookingFilters.from, bookingFilters.to]
  )

  const groupedDays: GroupedDaysList = useMemo(
    () => groupByMonth(dates, locale),
    [dates, locale]
  )

  const currentDate = useMemo(() => new Date(), [])

  return (
    <>
      <Box
        sx={{
          maxWidth: '100%',
          maxHeight: `calc(100vh - 64px - 72px - 64px - ${filterHeight}px - ${
            matchesSm ? 0 : 24
          }px - ${widthMax700 ? 64 : 0}px)`,
          overflowY: 'auto',
        }}
      >
        <TableVirtuoso
          style={{
            width: '100%',
            borderTop: 1,
            borderColor: 'divider',
            ...(status === 'pending' && {
              opacity: 0.4,
              pointerEvents: 'none',
            }),
            height: `calc(100vh - 64px - 72px - 64px - ${filterHeight}px - ${
              matchesSm ? 0 : 24
            }px - ${widthMax700 ? 64 : 0}px)`,
          }}
          fixedHeaderContent={() => (
            <SchedulerHeader
              dates={dates}
              groupedDays={groupedDays}
              currentDate={currentDate}
              locale={locale}
            />
          )}
          data={normalizedPlaces}
          totalCount={normalizedPlaces.length}
          components={{
            TableHead: TableHead,
            TableRow: TableRow,
          }}
          atTopThreshold={20}
          atBottomThreshold={20}
          overscan={30}
          // computeItemKey={(key) => key}
          itemContent={(index, item) => (
            <>
              {item.type === 'department' && (
                <DepartmentRow
                  key={index}
                  departmentName={item.departmentName}
                  hospitalName={item.hospitalName}
                  datesCount={dates.length}
                />
              )}
              {item.type === 'room' && (
                <SchedulerRoomsRow
                  key={index}
                  roomId={item.id}
                  roomNumber={item.room}
                  label={item.label}
                  datesCount={dates.length}
                  toggle={toggleCollapse}
                  collapsed={collapsedRooms}
                />
              )}
              {item.type === 'place' && (
                <SchedulerPlaceRow
                  key={index}
                  place={item.place}
                  dates={dates}
                  currentDate={currentDate}
                  canEdit={true}
                />
              )}
            </>
          )}
        />
      </Box>
    </>
  )
}
