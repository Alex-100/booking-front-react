import {
  IconButton,
  TableCell,
  TableRow,
  Typography,
  alpha,
} from '@mui/material'
import { Stack } from '@mui/system'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import isWeekend from 'date-fns/isWeekend'
import isSameDay from 'date-fns/isSameDay'
import { BookingPlace } from 'modules/Booking/types/BookingRecordModel'

interface SchedulerPlaceRowProps {
  place: BookingPlace
  canEdit: boolean
  dates: Array<Date>
  currentDate: Date
}

export const SchedulerPlaceRow = ({
  place,
  canEdit,
  dates,
  currentDate,
}: SchedulerPlaceRowProps) => {
  return (
    <TableRow>
      <TableCell
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          position: 'sticky',
          left: 0,
          background: 'white',
          zIndex: 50,
          pt: 0,
          pb: 0,
          pl: 7,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="caption">{place.number}</Typography>
          {canEdit && (
            <IconButton
              size="small"
              //   onClick={handleOpenBookingForm(place, room)}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </Stack>
      </TableCell>
      {dates.map((date, i) => (
        <TableCell
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            position: 'relative',
            minWidth: 48,
            width: 48,
            maxWidth: 48,
            p: 0,
            ...(isWeekend(date) && {
              bgcolor: (theme: any) =>
                alpha(
                  theme.palette.error.light,
                  theme.palette.action.activatedOpacity
                ),
            }),
            ...(isSameDay(date, currentDate) && {
              bgcolor: (theme: any) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
          key={i}
          //   onClick={handleOpenBookingFormByDate(place, room, moment(day))}
        >
          {/* {i === 0 &&
            place.bookings.map((booking) => (
              <PlaceClaimLine
                key={booking.id}
                booking={booking}
                place={place}
                room={room}
                canEdit={canEdit}
              />
            ))} */}
        </TableCell>
      ))}
    </TableRow>
  )
}
