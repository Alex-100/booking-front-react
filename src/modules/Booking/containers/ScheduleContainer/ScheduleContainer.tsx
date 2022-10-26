import React, { Fragment, useMemo } from 'react'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { alpha } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

import { useAppSelector } from '../../../../store'
import { useSearchQuery } from '../../state/bookingService'

import BookingFormContainer from '../BookingForm/BookingFormContainer'
import PlaceClaimLine from './components/PlaceClaimLine'
import Stack from '@mui/material/Stack'
import { DepartmentModel } from '../../../Department/DepartmentModel'
import { BookingRecordModel } from '../../types'
import Box from '@mui/material/Box'
import { DATE_FORMAT_TEMPLATE } from '../../../../constants'
import { PlaceModel, RoomModel } from '../../../Room/types'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useMediaQuery } from '@mui/material'
import { useAuth } from 'hooks'
import { useGetUserByUsernameQuery } from 'services'
// @ts-ignore
const moment = extendMoment(Moment)

const ScheduleContainer = ({ filterHeight }: { filterHeight: number }) => {
  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  const { data, status } = useSearchQuery(bookingFilters)

  const { t, i18n } = useTranslation()

  const auth = useAuth()
  const { data: user } = useGetUserByUsernameQuery(auth.user.username)
  const canEdit = React.useMemo(
    () =>
      user &&
      user.roles &&
      user.roles.filter((role) =>
        ['admin', 'booking_and_room_edit'].includes(role.name)
      ).length > 0
        ? true
        : false,
    [user]
  )

  // region bookingForm
  const [opened, setOpened] = React.useState<number[]>([])
  const [bookingFormOpen, setBookingFormOpen] = React.useState<
    [boolean, { place: any; room: any; initialDate?: string }]
  >([false, { place: -1, room: null, initialDate: '' }])

  const handleToggleRoom = (roomId: number) => () => {
    setOpened(
      opened.includes(roomId)
        ? opened.filter((v) => v !== roomId)
        : [...opened, roomId]
    )
  }

  const handleOpenBookingForm = (place: PlaceModel, room: RoomModel) => () =>
    setBookingFormOpen([true, { place, room }])

  const handleOpenBookingFormByDate = (
    place: PlaceModel,
    room: RoomModel,
    initialDate: any
  ) => (event: React.MouseEvent<HTMLTableCellElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const h = Math.round((x * 30) / 60)
    const m = Math.floor((x * 30) % 60)
    setBookingFormOpen([
      true,
      {
        place,
        room,
        initialDate: initialDate
          .set({ hour: h, minute: m })
          .format(DATE_FORMAT_TEMPLATE),
      },
    ])
  }

  const handleCloseBookingForm = () =>
    setBookingFormOpen([false, { place: null, room: null, initialDate: '' }])
  // endregion bookingForm

  // region computed
  const dateRangeArray = useMemo(() => {
    return Array.from(
      moment
        .range(
          moment(
            bookingFilters.from
              ? bookingFilters.from
              : new Date().toISOString().slice(0, 10) + ' 00:00'
          ),
          moment(
            bookingFilters.to
              ? bookingFilters.to
              : dayjs().add(7, 'day').startOf('day').toISOString()
          )
        )
        .by('day')
    )
  }, [bookingFilters.from, bookingFilters.to])

  type GroupByDepartment = {
    department: DepartmentModel
    rooms: BookingRecordModel[]
  }

  const groupedByDepartment =
    data?.content.reduce((acc, current) => {
      const accIndex = acc.findIndex(
        (v) => v.department.id === current.department.id
      )

      if (accIndex >= 0) {
        acc[accIndex].rooms.push(current)
        return acc
      }

      acc.push({
        department: current.department,
        rooms: [current],
      })

      return acc
    }, [] as GroupByDepartment[]) || []

  const matchesSm = useMediaQuery((theme: any) => theme.breakpoints.up('sm'))
  const widthMax700 = useMediaQuery('(max-width:700px)')
  // const matchesMD = useMediaQuery((theme: any) => theme.breakpoints.up('md'))

  // endregion computed
  console.log(bookingFormOpen)
  return (
    <TableContainer
      sx={{
        maxWidth: '100%',
        maxHeight: `calc(100vh - 64px - 72px - 64px - ${filterHeight}px - ${
          matchesSm ? 0 : 24
        }px - ${widthMax700 ? 64 : 0}px)`,
        overflowY: 'auto',
      }}
    >
      <Table
        stickyHeader
        size="small"
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          ...(status === 'pending' && {
            opacity: 0.4,
            pointerEvents: 'none',
          }),
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                minWidth: 140,
                borderRight: 1,
                borderColor: 'divider',
                position: 'sticky',
                zIndex: 110,
                left: 0,
                background: 'white',
                borderBottom: 'none',
              }}
            ></TableCell>
            {dateRangeArray
              .map((day) => day.locale(i18n.language).format('MMMM'))
              .reduce((acc, current, i, array) => {
                if (
                  acc.filter(
                    (v: { label: string; colspan: number }) =>
                      v.label === current
                  ).length > 0
                )
                  return acc
                acc.push({
                  label: current,
                  colspan: array.filter((v) => v === current).length,
                })
                return acc
              }, [] as { label: string; colspan: number }[])
              .map((month, i) => (
                <TableCell
                  sx={{
                    borderRight: 1,
                    borderColor: 'divider',
                    width: 64,
                    textAlign: 'center',
                    background: 'white',
                    zIndex: 100,
                    borderBottom: 'none',
                  }}
                  key={i}
                  colSpan={month.colspan}
                >
                  {month.label}
                </TableCell>
              ))}
          </TableRow>
          <TableRow sx={{ background: 'white' }}>
            <TableCell
              sx={{
                minWidth: 140,
                maxWidth: 180,
                borderRight: 1,
                borderTop: 1,
                borderColor: 'divider',
                position: 'sticky',
                zIndex: 120,
                left: 0,
                background: 'white',
              }}
            >
              {t('Room')}
            </TableCell>
            {dateRangeArray.map((day, i) => (
              <TableCell
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
                  ...([0, 6].includes(day.weekday()) && {
                    bgcolor: '#fdeaea',
                  }),
                  ...(day.isSame(moment(), 'day') && {
                    bgcolor: '#e3eefa',
                  }),
                }}
                key={i}
              >
                {day.format('D')}
                <br />
                <Typography variant="caption">{day.format('dd')}</Typography>
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedByDepartment.map((departmentGroup, ind) => (
            <Fragment key={ind}>
              <TableRow key={ind}>
                <TableCell
                  sx={{
                    bgcolor: (theme: any) => theme.palette.grey.A200,
                    position: 'sticky',
                    minWidth: 140,
                    maxWidth: 180,
                    height: 35,
                    left: 0,
                    pt: 0,
                    pb: 0,
                    overflowX: 'visible',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        position: 'absolute',
                        top: '-17.5px',
                        width: 'max-content',
                        lineHeight: '35px',
                      }}
                    >
                      {departmentGroup.department.name}
                      <Typography variant="caption" ml={2}>
                        ({departmentGroup.department.hospital.name})
                      </Typography>
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  colSpan={dateRangeArray.length}
                  sx={{
                    bgcolor: (theme: any) => theme.palette.grey.A200,
                    borderRight: 1,
                    borderColor: 'divider',
                  }}
                />
              </TableRow>
              {departmentGroup.rooms.map((room) => (
                <>
                  <TableRow key={room.id} onClick={handleToggleRoom(room.id)}>
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
                        <IconButton
                          size="small"
                          onClick={handleToggleRoom(room.id)}
                        >
                          {opened.includes(room.id) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
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
                        <Typography variant="subtitle2">
                          {room.roomNumber}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell
                      colSpan={dateRangeArray.length}
                      sx={{
                        bgcolor: (theme: any) => theme.palette.grey['50'],
                        borderRight: 1,
                        borderColor: 'divider',
                      }}
                    />
                  </TableRow>
                  {!opened.includes(room.id) &&
                    room.places.map((place) => (
                      <TableRow key={place.id}>
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
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Typography variant="caption">
                              {place.number}
                            </Typography>
                            {canEdit && (
                              <IconButton
                                size="small"
                                onClick={handleOpenBookingForm(place, room)}
                              >
                                <AddCircleOutlineIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </TableCell>
                        {dateRangeArray.map((day, i) => (
                          <TableCell
                            sx={{
                              borderRight: 1,
                              borderColor: 'divider',
                              position: 'relative',
                              minWidth: 48,
                              width: 48,
                              maxWidth: 48,
                              p: 0,
                              ...([0, 6].includes(day.weekday()) && {
                                bgcolor: (theme: any) =>
                                  alpha(
                                    theme.palette.error.light,
                                    theme.palette.action.activatedOpacity
                                  ),
                              }),
                              ...(day.isSame(moment(), 'day') && {
                                bgcolor: (theme: any) =>
                                  alpha(
                                    theme.palette.primary.main,
                                    theme.palette.action.activatedOpacity
                                  ),
                              }),
                            }}
                            key={i}
                            onClick={handleOpenBookingFormByDate(
                              place,
                              room,
                              moment(day)
                            )}
                          >
                            {i === 0 &&
                              place.bookings.map((booking) => (
                                <PlaceClaimLine
                                  key={booking.id}
                                  booking={booking}
                                  place={place}
                                  room={room}
                                />
                              ))}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      {bookingFormOpen[0] && canEdit && (
        <BookingFormContainer
          open={bookingFormOpen[0]}
          onClose={handleCloseBookingForm}
          {...bookingFormOpen[1]}
        />
      )}
    </TableContainer>
  )
}

export default ScheduleContainer
