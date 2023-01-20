import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/lab/AlertTitle'
import Stack from '@mui/material/Stack'
import { useSnackbar } from 'notistack'
import {
  useCreateBookingGroupMutation,
  useCreateBookingMutation,
  useUpdateBookingMutation,
} from '../../state/bookingService'
import { BookingCreateForm } from '../../types'
import {
  SourceFundingEnum,
  StatusOfBookingEnum,
  TypeOfBookingEnum,
} from '../../types/enums'
import { DATE_FORMAT_TEMPLATE } from '../../../../constants'
import moment from 'moment'
import { useAuth } from '../../../../hooks'
import { useGetUserByUsernameQuery } from '../../../User/user'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
// import ManualBookingForm from './forms/ManualBookingForm'
import RepairBookingForm from './forms/RepairBookingForm'
// import AutoBookingForm from './forms/AutoBookingForm'
// import FindByIIDBookingForm from './forms/FindByIIDBookingForm'
import GroupBookingForm from './forms/GroupBookingForm'
import { PlaceModel, RoomModel } from '../../../Room/types'
import { useTranslation } from 'react-i18next'
import { IndividualBookingForm } from './forms/IndividualBookingForm'

interface Props {
  open: boolean
  onClose(): void
  initialValues?: BookingCreateForm
  initialDate?: string
  place: PlaceModel
  room?: RoomModel
}

const BookingFormContainer: React.FC<Props> = (props) => {
  const { open, onClose, initialValues, place, initialDate } = props
  const { enqueueSnackbar } = useSnackbar()
  const auth = useAuth()
  const { t } = useTranslation()

  let initEnteringDate = initialDate
    ? initialDate
    : moment().format(DATE_FORMAT_TEMPLATE)

  const [value, setValue] = React.useState(
    !!initialValues
      ? initialValues.typeOfBooking === TypeOfBookingEnum.INDIVIDUAL
        ? 0
        : initialValues.typeOfBooking === TypeOfBookingEnum.REPAIR
        ? 1
        : 2
      : 0
  )
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const [loadedUser, setLoadedUser] = React.useState({
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
  })
  const handleSetLoadedUser = (user: any) => {
    setLoadedUser({ ...loadedUser, [value]: user })
  }

  const { data: user } = useGetUserByUsernameQuery(auth.user.username)
  const [submitCreate, responseCreate] = useCreateBookingMutation()
  const [submitUpdate, responseUpdate] = useUpdateBookingMutation()
  const [
    submitCreateGroup,
    responseCreateGroup,
  ] = useCreateBookingGroupMutation()

  const handleSubmit = (values: BookingCreateForm) => {
    const {
      enteringDateD,
      enteringTime,
      leavingDateD,
      leavingTime,
      ...tmpValues
    } = values
    const nValues = {
      ...tmpValues,
      enteringDate: `${enteringDateD} ${enteringTime}`,
      leavingDate: `${leavingDateD} ${leavingTime}`,
    }
    if (value === 2 && !initialValues) {
      submitCreateGroup({
        ...nValues,
        typeOfBooking: undefined,
      })
      return
    }

    if (initialValues) {
      const placeId: number =
        Array.isArray(nValues.placeId) && nValues.placeId.length > 0
          ? nValues.placeId[0]
          : place.id
      submitUpdate({
        ...initialValues,
        ...nValues,
        placeId,
        typeOfBooking: undefined,
      })
    } else {
      console.log('Values to SAVE', values)
      submitCreate({
        ...nValues,
        // placeId: place.id,
        typeOfBooking:
          value === 0
            ? TypeOfBookingEnum.INDIVIDUAL
            : value === 1
            ? TypeOfBookingEnum.REPAIR
            : TypeOfBookingEnum.GROUP,
      })
    }
  }

  const errorCreateMessage = React.useMemo(() => {
    if (responseCreate.error) {
      if ('data' in responseCreate.error) {
        /* @ts-ignore */
        const s1 = responseCreate.error.data?.message
        /* @ts-ignore */
        const s2 = responseCreate.error.data?.error
        //
        return s1 || s2
      } else return 'ERROR'
    } else return ''
  }, [responseCreate.error])

  const errorCreateGroupMessage = React.useMemo(() => {
    if (responseCreateGroup.error) {
      if ('data' in responseCreateGroup.error) {
        /* @ts-ignore */
        const s1 = responseCreateGroup.error.data?.message
        /* @ts-ignore */
        const s2 = responseCreateGroup.error.data?.error
        //
        return s1 || s2
      } else return 'ERROR'
    } else return ''
  }, [responseCreateGroup.error])

  const errorUpdateMessage = React.useMemo(() => {
    if (responseUpdate.error) {
      if ('data' in responseUpdate.error) {
        /* @ts-ignore */
        const s1 = responseUpdate.error.data?.message
        /* @ts-ignore */
        const s2 = responseUpdate.error.data?.error
        //
        return s1 || s2
      } else return 'ERROR'
    } else return ''
  }, [responseUpdate.error])

  React.useEffect(() => {
    if (
      (responseCreate && responseCreate.status === 'fulfilled') ||
      (responseCreateGroup && responseCreateGroup.status === 'fulfilled') ||
      (responseUpdate && responseUpdate.status === 'fulfilled')
    ) {
      onClose()
      enqueueSnackbar(t('Success booking'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }

    if (
      (responseCreate && responseCreate.status === 'rejected') ||
      (responseCreateGroup && responseCreateGroup.status === 'rejected') ||
      (responseUpdate && responseUpdate.status === 'rejected')
    ) {
      enqueueSnackbar(t('Error booking'), {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }
  }, [responseCreate, responseUpdate, responseCreateGroup])

  return (
    <Dialog
      onClose={onClose}
      maxWidth="lg"
      open={open}
      sx={{ overflow: 'visible' }}
    >
      <DialogTitle>
        {initialValues ? t('Edit booking') : t('Create a booking')}
      </DialogTitle>
      <DialogContent
        sx={{ overflow: 'visible' }}
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <Stack direction="column" spacing={3} maxWidth="min-content">
          {!initialValues && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange}>
                {/* <Tab label="Manual" />
                <Tab label="Auto" />
                <Tab label="Find by id" /> */}
                <Tab label={t('Individual')} />
                <Tab label={t('Repair')} />
                <Tab label={t('Group')} />
              </Tabs>
            </Box>
          )}
          {responseCreate && responseCreate.status === 'rejected' && (
            <Alert severity="error">
              <AlertTitle>{t('Error')}</AlertTitle>
              {errorCreateMessage}
            </Alert>
          )}
          {responseUpdate && responseUpdate.status === 'rejected' && (
            <Alert severity="error">
              <AlertTitle>{t('Error')}</AlertTitle>
              {errorUpdateMessage}
            </Alert>
          )}
          {responseCreateGroup && responseCreateGroup.status === 'rejected' && (
            <Alert severity="error">
              <AlertTitle>{t('Error')}</AlertTitle>
              {errorCreateGroupMessage}
            </Alert>
          )}
          {/* {value === 0 && (
            <ManualBookingForm
              onSubmit={handleSubmit}
              response={responseCreate || responseUpdate}
              initialValues={{
                statusOfBooking: StatusOfBookingEnum.BOOKED,
                enteringDate: initEnteringDate,
                userId: user?.id,
                ...initialValues,
              }}
              edit={!!initialValues}
            />
          )} */}
          {value === 0 && (
            <IndividualBookingForm
              onSubmit={handleSubmit}
              initialPlace={place}
              response={responseCreate || responseUpdate}
              initialValues={Object.assign(
                {
                  statusOfBooking: StatusOfBookingEnum.BOOKED,
                  enteringDate: initEnteringDate,
                  userId: user?.id,
                  ...initialValues,
                },
                loadedUser[1] && loadedUser[1]
              )}
              edit={!!initialValues}
              onSetUser={handleSetLoadedUser}
            />
          )}
          {/* {value === 2 && (
            <FindByIIDBookingForm
              onSubmit={handleSubmit}
              response={responseCreate || responseUpdate}
              initialValues={Object.assign(
                {
                  statusOfBooking: StatusOfBookingEnum.BOOKED,
                  enteringDate: initEnteringDate,
                  userId: user?.id,
                  ...initialValues,
                },
                loadedUser[2] && loadedUser[2]
              )}
              edit={!!initialValues}
              onSetUser={handleSetLoadedUser}
            />
          )} */}
          {value === 1 && (
            <RepairBookingForm
              onSubmit={handleSubmit}
              initialPlace={place}
              response={responseCreate || responseUpdate}
              initialValues={{
                statusOfBooking: StatusOfBookingEnum.BOOKED,
                sourceFunding: SourceFundingEnum.OTHER,
                enteringDate: initEnteringDate,
                userId: user?.id,
                ...initialValues,
              }}
              edit={!!initialValues}
            />
          )}
          {value === 2 && (
            <GroupBookingForm
              onSubmit={handleSubmit}
              response={responseCreate || responseUpdate}
              initialValues={{
                statusOfBooking: StatusOfBookingEnum.BOOKED,
                sourceFunding: SourceFundingEnum.OTHER,
                enteringDate: initEnteringDate,
                userId: user?.id,
                ...initialValues,
              }}
              edit={!!initialValues}
            />
          )}
          {/*<BookingForm*/}
          {/*  onSubmit={handleSubmit}*/}
          {/*  response={responseCreate || responseUpdate}*/}
          {/*  initialValues={{*/}
          {/*    statusOfBooking: StatusOfBookingEnum.BOOKED,*/}
          {/*    enteringDate: moment().format(DATE_FORMAT_TEMPLATE),*/}
          {/*    userId: user?.id,*/}
          {/*    ...initialValues,*/}
          {/*  }}*/}
          {/*  edit={!!initialValues}*/}
          {/*/>*/}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default BookingFormContainer
