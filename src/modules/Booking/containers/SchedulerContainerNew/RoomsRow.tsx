import {
  Box,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { BookingRecordModel } from 'modules/Booking/types'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { SchedulerPlaceRow } from './SchedulerPlaceRow'

interface RoomsRowProps {
  datesCount: number
  room: BookingRecordModel
  canEdit: boolean
  dates: Array<Date>
  currentDate: Date
}

export const RoomsRow = ({
  room,
  datesCount,
  canEdit,
  dates,
  currentDate,
}: RoomsRowProps) => (
  <>
    {' '}
    <TableRow>
      <TableCell
        sx={{
          width: 140,
          borderColor: 'divider',
          position: 'sticky',
          left: 0,
          bgcolor: (theme: any) => theme.palette.grey['50'],
          pt: 0,
          pb: 0,
          pl: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small">
            {/* {opened.includes(room.id) ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )} */}
            <KeyboardArrowUpIcon />
          </IconButton>
          <Box
            sx={{
              bgcolor: room.label.color,
              width: 10,
              height: 10,
              borderRadius: 5,
              ml: 0.5,
              border: '1px solid rgb(0 0 0 / 20%)',
            }}
          />
          <Typography variant="subtitle2">{room.roomNumber}</Typography>
        </Stack>
      </TableCell>
      <TableCell
        colSpan={datesCount}
        sx={{
          bgcolor: (theme: any) => theme.palette.grey['50'],
          borderRight: 1,
          borderColor: 'divider',
        }}
      />
    </TableRow>
    {room.places.map((place) => (
      <SchedulerPlaceRow
        key={place.id}
        canEdit={canEdit}
        place={place}
        dates={dates}
        currentDate={currentDate}
      />
    ))}
  </>
)
