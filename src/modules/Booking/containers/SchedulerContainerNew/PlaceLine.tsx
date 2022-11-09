import { Box } from '@mui/material'
import addDays from 'date-fns/addDays'
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval'
import isBefore from 'date-fns/isBefore'
import parseISO from 'date-fns/parseISO'
import { BookingModel } from 'modules/Booking/types'
import { TypeOfBookingEnum } from 'modules/Booking/types/enums'
import { PlaceModel } from 'modules/Room/types'
import { useMemo } from 'react'
import { useAppSelector } from 'store'

interface PlaceLineProps {
  place: PlaceModel
  booking: BookingModel
}

export const PlaceLine = ({ place, booking }: PlaceLineProps) => {
  const bookingFilters = useAppSelector((state) => state.bookingFilters)

  const isOverflow = isBefore(
    addDays(parseISO(bookingFilters.to), 1),
    parseISO(booking.leavingDate)
  )

  const w = useMemo(
    () =>
      eachMinuteOfInterval({
        start: parseISO(booking.enteringDate),
        end: parseISO(booking.leavingDate),
      }).length / 30,
    [booking.enteringDate, booking.leavingDate]
  )

  const l = useMemo(
    () =>
      eachMinuteOfInterval({
        start: parseISO(bookingFilters.from.slice(0, 10)),
        end: parseISO(booking.enteringDate),
      }).length / 30,
    [bookingFilters.from, booking.enteringDate]
  )

  const overflow = useMemo(() => {
    const d1 = parseISO(booking.leavingDate)
    const d2 = addDays(parseISO(bookingFilters.to.slice(0, 10)), 1)
    const interval =
      d1 < d2
        ? eachMinuteOfInterval({
            start: d1,
            end: d2,
          })
        : eachMinuteOfInterval({
            start: d2,
            end: d1,
          })
    return interval.length / 30
  }, [booking.leavingDate, bookingFilters.to])

  const color = ((type) => ({ palette }: any) => {
    switch (type) {
      case TypeOfBookingEnum.INDIVIDUAL:
        return palette.primary.main
      case TypeOfBookingEnum.REPAIR:
        return palette.secondary.main
      case TypeOfBookingEnum.GROUP:
        return palette.success.main
      case TypeOfBookingEnum.INTERNET_CHATBOT:
        return palette.info.main
      case TypeOfBookingEnum.INTERNET_WEB:
        return palette.info.main
      default:
        return palette.primary.main
    }
  })(booking.typeOfBooking)

  const borderColor = ((type) => ({ palette }: any) => {
    switch (type) {
      case TypeOfBookingEnum.INDIVIDUAL:
        return palette.primary.dark
      case TypeOfBookingEnum.REPAIR:
        return palette.secondary.dark
      case TypeOfBookingEnum.GROUP:
        return palette.success.dark
      case TypeOfBookingEnum.INTERNET_CHATBOT:
        return palette.info.dark
      case TypeOfBookingEnum.INTERNET_WEB:
        return palette.info.dark
      default:
        return palette.primary.dark
    }
  })(booking.typeOfBooking)

  const handleClickOnBookingLine = () => {
    console.log(place)
  }

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          zIndex: 40,
          height: 35,
          left: l,
          width: w - (isOverflow ? overflow : 0),
        }}
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 12,
            borderRadius: isOverflow ? '8px 0 0 8px' : 8,
            marginTop: '11px',
            bgcolor: color,
            borderColor: borderColor,
          }}
          component="button"
          onClick={handleClickOnBookingLine}
        />
      </Box>
    </>
  )
}
