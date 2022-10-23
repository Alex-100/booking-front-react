import React, { useEffect, useState } from 'react'
import { Field, reduxForm } from 'redux-form'
import Stack from '@mui/material/Stack'
import LoadingButton from '@mui/lab/LoadingButton'

import { renderSelectField } from '../../../../../components/redux-form'
import { FormProps } from '../../../../../components/redux-form/types'
import { validators } from '../../../../../utils'

import { BookingCreateForm } from '../../../types'
import MenuItem from '@mui/material/MenuItem'

import {
  sourceFundingOptionsFn,
  statusOfBookingOptionsFn,
} from '../../../constants'
import Typography from '@mui/material/Typography'
import UserSelectorField from './components/UserSelectorField'
import useMediaQuery from '@mui/material/useMediaQuery'
import Paper from '@mui/material/Paper'
import DateRangeFields from './components/DateRangeFields'
import { SourceFundingEnum, StatusOfBookingEnum } from '../../../types/enums'
import PlaceSelector from './components/PlaceSelector'
import { useTranslation } from 'react-i18next'
import { useGetRoomByPlaceIdMutation } from 'modules/Room/services/roomService'
import { SelectedPlaceInfo } from 'types/SelectedPlaceInfo'
import { PlaceModel } from 'modules/Room/types'

interface Props extends FormProps {
  edit?: boolean
  enteringDate?: string
  initialPlace?: PlaceModel
}

const RepairBookingForm = reduxForm<BookingCreateForm, Props>({
  form: 'repairBooking',
})((props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    invalid,
    response,
    initialValues,
    initialPlace,
    change,
    edit,
  } = props
  console.log(initialValues)
  const matchSm = useMediaQuery((theme: any) => theme.breakpoints.up('md'))
  const { t } = useTranslation()

  const [getRoomByPlaceId, { data: roomInfo }] = useGetRoomByPlaceIdMutation()
  const [placeInfo, setPlaceInfo] = useState<SelectedPlaceInfo>()

  useEffect(() => {
    if (initialPlace) {
      getRoomByPlaceId(initialPlace.id)
    }
  }, [initialPlace])

  useEffect(() => {
    if (roomInfo && initialPlace) {
      const place = roomInfo.places.find((item) => item.id === initialPlace?.id)
      // console.log(props.room)
      const usedPlace: SelectedPlaceInfo = {
        id: initialPlace.id,
        number: place?.number || 0,
        departmentId: roomInfo.department.id,
        departmentName: roomInfo.department.name,
        hospitalId: roomInfo.department.hospital.id,
        hospitalName: roomInfo.department.hospital.name,
        roomId: roomInfo.id,
        roomNumber: roomInfo.roomNumber,
      }
      setPlaceInfo(usedPlace)
    }
  }, [roomInfo])

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={4}
        width={!matchSm ? '100%' : 640}
      >
        <Paper sx={{ p: 2, width: '100%' }} variant="outlined">
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {t('Common')}
          </Typography>
          <Stack spacing={3}>
            <Stack
              direction={!matchSm ? 'column' : 'row'}
              spacing={2}
              sx={{ width: '100%' }}
            >
              <Field
                name="statusOfBooking"
                label={t('Status')}
                component={renderSelectField}
                required
                disabled
                validate={[validators.required]}
              >
                {statusOfBookingOptionsFn().map(([k, l]) => (
                  <MenuItem
                    value={k}
                    key={k}
                    selected={k === StatusOfBookingEnum.BOOKED}
                  >
                    {l}
                  </MenuItem>
                ))}
              </Field>
              <Field
                name="sourceFunding"
                label={t('Funding')}
                component={renderSelectField}
                required
                disabled
                validate={[validators.required]}
              >
                {sourceFundingOptionsFn().map(([k, l]) => (
                  <MenuItem
                    value={k}
                    key={k}
                    selected={k === SourceFundingEnum.OTHER}
                  >
                    {l}
                  </MenuItem>
                ))}
              </Field>
            </Stack>
            <DateRangeFields form="repairBooking" change={change} edit={edit} />

            <Field
              name="placeId"
              component={PlaceSelector}
              placeInfo={placeInfo}
            />
            <Field
              name="userId"
              component={UserSelectorField}
              required
              validate={[validators.required]}
            />
          </Stack>
        </Paper>
        <LoadingButton
          variant="outlined"
          type="submit"
          disabled={invalid || pristine || submitting}
          loading={response.status === 'pending'}
          loadingPosition="center"
          sx={{ width: 120 }}
        >
          {t('Save')}
        </LoadingButton>
      </Stack>
    </form>
  )
})

export default RepairBookingForm
