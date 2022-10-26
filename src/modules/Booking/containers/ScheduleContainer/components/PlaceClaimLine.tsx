import React from 'react'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { BookingModel } from '../../../types'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getUserShortName } from '../../../../../utils'
import Paper from '@mui/material/Paper'
import EntityRemoveModal from '../../../../../components/layouts/EntityRemoveModal'
import {
  useRemoveBookingGroupMutation,
  useRemoveBookingMutation,
} from '../../../state/bookingService'
import BookingFormContainer from '../../BookingForm/BookingFormContainer'
import { useAppSelector } from '../../../../../store'
import { TypeOfBookingEnum } from '../../../types/enums'
import { PlaceModel, RoomModel } from '../../../../Room/types'
import { useTranslation } from 'react-i18next'
import {
  sourceFundingOptionsFn,
  statusOfBookingOptionsFn,
  typeOfBookingOptionsFn,
} from 'modules/Booking/constants'
import { format, parseISO } from 'date-fns'
import { useAuth } from 'hooks'
import { useGetUserByUsernameQuery } from 'services'

// @ts-ignore
const moment = extendMoment(Moment)

interface Props {
  place: PlaceModel
  room: RoomModel
  booking: BookingModel
}

const PlaceClaimLine: React.FC<Props> = ({ booking, place, room }) => {
  const { t, i18n } = useTranslation()
  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false)
  const handleToggleRemoveModal = () => {
    setOpenRemoveModal(!openRemoveModal)
  }

  const [openGroupRemoveModal, setOpenGroupRemoveModal] = React.useState(false)
  const handleToggleGroupRemoveModal = () => {
    setOpenGroupRemoveModal(!openGroupRemoveModal)
  }

  const [openEditModal, setOpenEditModal] = React.useState(false)
  const handleToggleEditModal = () => {
    setOpenEditModal(!openEditModal)
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

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

  const isOverflow = moment(bookingFilters.to).isBefore(booking.leavingDate)

  const w =
    Array.from(
      moment
        .range(moment(booking.leavingDate), moment(booking.enteringDate))
        .by('minutes')
    ).length / 30

  const overflow =
    Array.from(
      moment
        .range(
          moment(bookingFilters.to.slice(0, 10)).add(1, 'day'),
          moment(booking.leavingDate)
        )
        .by('minutes')
    ).length / 30

  const l =
    Array.from(
      moment
        .range(
          moment(bookingFilters.from.slice(0, 10)),
          moment(booking.enteringDate)
        )
        .by('minutes')
    ).length / 30

  const formData = {
    ...booking,
    placeId: place.id,
    comboRateId: booking.comboRate?.id,
    userId: booking.appUser.id,
    sendById: booking.sentByCompany?.id,
    enteringDateD: '',
    enteringTime: '',
    leavingDateD: '',
    leavingTime: '',
  }

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
          onClick={handleClick}
        />
      </Box>
      <Popover
        id={`PlaceClaimLine${booking.id}`}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={(event) => {
          event.stopPropagation()
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, pb: 0 }}
          justifyContent="space-between"
          alignItems="center"
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Typography variant="subtitle2">
            {getUserShortName(booking.appUser)}
          </Typography>
          <Stack direction="row" spacing={1}>
            {booking.typeOfBooking !== TypeOfBookingEnum.GROUP && (
              <IconButton
                size="small"
                onClick={handleToggleEditModal}
                disabled={!canEdit}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}

            {booking.typeOfBooking === TypeOfBookingEnum.GROUP && (
              <>
                <IconButton
                  size="small"
                  onClick={handleToggleGroupRemoveModal}
                  disabled={!canEdit}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
            {booking.typeOfBooking !== TypeOfBookingEnum.GROUP && (
              <IconButton
                size="small"
                onClick={handleToggleRemoveModal}
                disabled={!canEdit}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}

            {openEditModal && (
              <BookingFormContainer
                open={openEditModal}
                onClose={handleToggleEditModal}
                place={place}
                room={room}
                initialValues={formData}
              />
            )}
          </Stack>
        </Stack>
        <Stack spacing={1} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('Type')}:{' '}
            </Typography>
            <Typography>
              {
                typeOfBookingOptionsFn().find(
                  (type) => type[0] === booking.typeOfBooking
                )?.[1]
              }
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('Status')}:{' '}
            </Typography>
            <Typography>
              {
                statusOfBookingOptionsFn().find(
                  (status) => status[0] === booking.statusOfBooking
                )?.[1]
              }{' '}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('Source funding')}:{' '}
            </Typography>
            <Typography>
              {
                sourceFundingOptionsFn().find(
                  (f) => f[0] === booking.sourceFunding
                )?.[1]
              }{' '}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('Entering date')}:{' '}
            </Typography>
            <Typography>
              {format(
                parseISO(booking.enteringDate),
                i18n.language === 'ru' ? 'dd.MM.yyyy HH:mm' : 'yyyy-MM-dd HH:mm'
              )}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('Leaving date')}:{' '}
            </Typography>
            <Typography>
              {format(
                parseISO(booking.leavingDate),
                i18n.language === 'ru' ? 'dd.MM.yyyy HH:mm' : 'yyyy-MM-dd HH:mm'
              )}
            </Typography>
          </Stack>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('Full name')}:{' '}
              </Typography>
              <Typography>
                {booking.appUser.surname} {booking.appUser.name}{' '}
                {booking.appUser.patrName}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('Birth date')}:{' '}
              </Typography>
              <Typography>
                {booking.appUser.dob ? (
                  <>
                    {format(
                      parseISO(booking.appUser.dob),
                      i18n.language === 'ru' ? 'dd.MM.yyyy' : 'yyyy-MM-dd'
                    )}
                  </>
                ) : (
                  ''
                )}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                IID:{' '}
              </Typography>
              <Typography>{booking.appUser.individualId}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('Gender')}:{' '}
              </Typography>
              <Typography>
                {booking.appUser.gender === 'MALE' ? t('Male') : t('Female')}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Popover>
      <EntityRemoveModal
        open={openRemoveModal}
        onClose={handleToggleRemoveModal}
        entityData={booking.id}
        title={t('Do you want to delete a booking item?')}
        mutation={useRemoveBookingMutation}
      />
      <EntityRemoveModal
        open={openGroupRemoveModal}
        onClose={handleToggleGroupRemoveModal}
        entityData={booking.groupBookingId}
        title={t('Do you want to delete a booking group?')}
        mutation={useRemoveBookingGroupMutation}
      />
    </>
  )
}

export default PlaceClaimLine
