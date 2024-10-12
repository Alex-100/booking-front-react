import {
  Box,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import parseISO from 'date-fns/parseISO'
import { useSearchQuery } from 'modules/Booking/state/bookingService'
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAppSelector } from 'store'
import { useTranslation } from 'react-i18next'
import { getDateLocale, groupByMonth, normalizeSchedulerData } from './tools'
import { GroupedDaysList } from './interfaces'
import { SchedulerHeader } from './SchedulerHeader'
import { DepartmentRow } from './DepartmentRow'
import { ListRange, TableVirtuoso, TableVirtuosoHandle } from 'react-virtuoso'
import { SchedulerRoomsRow } from './SchedulerRoomsRow'
import { SchedulerPlaceRow } from './SchedulerPlaceRow'
import BookingFormContainer from '../BookingForm/BookingFormContainer'
import { PlaceModel } from 'modules/Room/types'
import format from 'date-fns/format'
import { useAuth } from 'hooks'

interface SchedulerContainedNewProps {
  filterHeight: number
}

interface BookingPlaceParam {
  place: PlaceModel
  date: Date | undefined
}

export const SchedulerContainedNew = ({
  filterHeight,
}: SchedulerContainedNewProps) => {
  const matchesSm = useMediaQuery((theme: any) => theme.breakpoints.up('sm'))
  const widthMax700 = useMediaQuery('(max-width:700px)')

  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  // bookingFilters.
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

  const [bookingPlaceParam, setBookingPlaceParam] = useState<
    BookingPlaceParam | undefined
  >(undefined)

  const handleOpenBooking = useCallback(
    (place: PlaceModel) => setBookingPlaceParam({ place, date: undefined }),
    []
  )

  const handleOpenBookingByDate = useCallback(
    (place: PlaceModel, date: Date) => setBookingPlaceParam({ place, date }),
    []
  )

  const handleCloseBooking = useCallback(
    () => setBookingPlaceParam(undefined),
    []
  )

  const auth = useAuth()
  const canEdit = useMemo(() => auth.check('admin', 'booking_and_room_edit'), [
    auth,
  ])

  const refCnt = useRef<TableVirtuosoHandle>(null)
  // const refScroller = useRef(null)

  // useEffect(() => {
  //   if (refCnt && refCnt.current) {
  //     console.log('REf', refCnt.current)
  //   }
  // }, [refCnt.current])

  // const scrollerRef = useRef()
  // const handleScrollerRef = useCallback((ref) => {
  //   scrollerRef.current = ref
  // }, [])

  // useEffect(() => {
  //   if (scrollerRef && scrollerRef.current) {
  //     console.log('REF SCROLLER', scrollerRef.current)
  //   }
  // }, [scrollerRef.current])

  // const {cl\\} = scrollerRef.current
  // const [range, setRange] = useState<ListRange | undefined>()

  // const handleRangeChange = (arange: ListRange) => {
  //   // setRange(arange)
  // }

  const range = useRef<number>(0)
  const handleRangeChange = useCallback((r: ListRange) => {
    console.log('RANGE', r)
    range.current = r.startIndex
  }, [])

  // useEffect(() => {
  //   console.log('DATA UPDATES', range)
  //   if (range) {
  //     // refCnt.current?.scrollToIndex(range.startIndex)
  //   }
  // }, [data])

  // const [scrolled, setScrolled] = useState<{
  //   scrollLeft: number
  //   scrollTop: number
  // }>({ scrollLeft: 0, scrollTop: 0 })

  const scrolled = useRef<{
    scrollLeft: number
    scrollTop: number
  }>({ scrollLeft: 0, scrollTop: 0 })

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.currentTarget) {
      const { scrollLeft, scrollTop } = e.currentTarget
      scrolled.current = { scrollLeft, scrollTop }
      console.log(scrollLeft, scrollTop)
    }
  }

  useLayoutEffect(() => {
    console.log('Loaded normalized place', scrolled.current, range)
    const { scrollLeft, scrollTop } = scrolled.current
    setTimeout(() => {
      console.log('SCROLLED IN', scrollLeft, scrollTop, range)
      refCnt.current?.scrollTo({
        // left: scrollLeft,
        top: scrollTop,
      })
    }, 10)

    // setTimeout(() => {
    //   console.log('SCROLLED IN 2', scrollLeft, scrollTop, range)
    //   refCnt.current?.scrollTo({
    //     behavior: 'smooth',
    //     left: scrollLeft,
    //     top: scrollTop,
    //   })
    // }, 400)
  }, [normalizedPlaces])

  return (
    <>
      <Box
        sx={{
          maxWidth: '100%',
          maxHeight: `calc(100vh - 64px - 72px - 48px - ${filterHeight}px - ${
            matchesSm ? 0 : 24
          }px - ${widthMax700 ? 64 : 0}px)`,
          overflowY: 'auto',
        }}
      >
        <TableVirtuoso
          ref={refCnt}
          rangeChanged={handleRangeChange}
          // initialTopMostItemIndex={range.current}
          // rangeChanged={setRange}
          // scrollerRef={handleScrollerRef}
          style={{
            width: '100%',
            borderTop: 1,
            borderColor: 'divider',
            ...(status === 'pending' && {
              opacity: 0.4,
              pointerEvents: 'none',
            }),
            height: `calc(100vh - 64px - 72px - 48px - ${filterHeight}px - ${
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
            Scroller: React.forwardRef((props, ref) => (
              <TableContainer
                component={Box}
                {...props}
                ref={ref}
                onScroll={handleScroll}
              />
            )),
            TableHead: ({ style, ...props }) => (
              <TableHead
                {...props}
                style={{ zIndex: 280, position: 'sticky', top: '0px' }}
              />
            ),
            // TableHead: TableHead,
            TableBody: React.forwardRef((props, ref) => (
              <TableBody {...props} ref={ref} />
            )),
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
                  canEdit={canEdit}
                  handleOpenBookingForPlace={handleOpenBooking}
                  handleOpenBookingForPlaceAndDate={handleOpenBookingByDate}
                />
              )}
            </>
          )}
        />
        {bookingPlaceParam !== undefined && (
          <BookingFormContainer
            open={bookingPlaceParam !== undefined}
            onClose={handleCloseBooking}
            place={bookingPlaceParam.place}
            initialDate={
              bookingPlaceParam.date !== undefined
                ? format(bookingPlaceParam.date, 'yyyy-MM-dd HH:mm')
                : undefined
            }
          />
        )}
      </Box>
    </>
  )
}
