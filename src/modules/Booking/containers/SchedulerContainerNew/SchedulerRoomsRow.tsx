import { Box, IconButton, Stack, TableCell, Typography } from '@mui/material'
// import { BookingRecordModel } from 'modules/Booking/types'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { LabelModel } from 'types'

interface SchedulerRoomsRowProps {
  roomId: number
  roomNumber: number
  label: LabelModel
  datesCount: number
  toggle: (roomId: number) => void
  collapsed: Array<number>
}
export const SchedulerRoomsRow = ({
  roomId,
  roomNumber,
  label,
  datesCount,
  toggle,
  collapsed,
}: SchedulerRoomsRowProps) => {
  return (
    <>
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
          <IconButton size="small" onClick={() => toggle(roomId)}>
            {collapsed.includes(roomId) ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
            {/* <KeyboardArrowUpIcon /> */}
          </IconButton>
          <Box
            sx={{
              bgcolor: label.color,
              width: 10,
              height: 10,
              borderRadius: 5,
              ml: 0.5,
              border: '1px solid rgb(0 0 0 / 20%)',
            }}
          />
          <Typography variant="subtitle2">{roomNumber}</Typography>
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
    </>
  )
}
