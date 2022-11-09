import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { BookingModel } from '../../types'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getUserShortName } from '../../../../utils'
import Paper from '@mui/material/Paper'
import EntityRemoveModal from '../../../../components/layouts/EntityRemoveModal'
import {
  //   useRemoveBookingGroupMutation,
  useRemoveBookingMutation,
} from '../../state/bookingService'
// import BookingFormContainer from '../BookingForm/BookingFormContainer'
// import { useAppSelector } from '../../../../store'
import { TypeOfBookingEnum } from '../../types/enums'
// import { PlaceModel, RoomModel } from '../../../Room/types'
import { useTranslation } from 'react-i18next'
import {
  sourceFundingOptionsFn,
  statusOfBookingOptionsFn,
  typeOfBookingOptionsFn,
} from 'modules/Booking/constants'
import { format, parseISO } from 'date-fns'
import { useState } from 'react'

interface PlaceLinePoppoverProps {
  booking: BookingModel
  open: boolean
  handleClose: () => void
  canEdit: boolean
  anchorEl: HTMLButtonElement | null
}

export const PlaceLinePoppover = ({
  booking,
  open,
  handleClose,
  canEdit,
  anchorEl,
}: PlaceLinePoppoverProps) => {
  const { t, i18n } = useTranslation()

  const [openRemoveModal, setOpenRemoveModal] = useState(false)
  const handleToggleRemoveModal = () => {
    setOpenRemoveModal(!openRemoveModal)
  }

  return (
    <>
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
                // onClick={handleToggleEditModal}
                disabled={!canEdit}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}

            {booking.typeOfBooking === TypeOfBookingEnum.GROUP && (
              <>
                <IconButton
                  size="small"
                  //   onClick={handleToggleGroupRemoveModal}
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

            {/* {openEditModal && (
              <BookingFormContainer
                open={openEditModal}
                onClose={handleToggleEditModal}
                place={place}
                room={room}
                initialValues={formData}
              />
            )} */}
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
    </>
  )
}
