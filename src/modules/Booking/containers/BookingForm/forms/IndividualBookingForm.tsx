import {
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { BookingCreateForm } from 'modules/Booking/types'
import { useTranslation } from 'react-i18next'
import { Field, reduxForm } from 'redux-form'
import PlaceSelector from './components/PlaceSelector'
import UserSelectorField from './components/UserSelectorField'
import { validators } from '../../../../../utils'
import CompanySelectorField from './components/CompanySelectorField'
import { renderSelectField, renderTextField } from 'components/redux-form'
import {
  sourceFundingOptionsFn,
  statusOfBookingOptionsFn,
} from 'modules/Booking/constants'
import { useGetAllComboRateQuery } from 'modules/Rate/services'
import DateRangeFields from './components/DateRangeFields'
import { dateMask, phoneMask } from 'utils/masks'
import { LoadingButton } from '@mui/lab'
import { FormProps } from '../../../../../components/redux-form/types'
import { CasesExternalSearch } from './components/CasesExternalSearch'
import { CaseSearchNewItem } from 'modules/Booking/state/externalSearchService'
import { PlaceModel } from 'modules/Room/types'
import { useEffect, useState } from 'react'
import { useGetRoomByPlaceIdMutation } from 'modules/Room/services/roomService'
import { SelectedPlaceInfo } from 'types/SelectedPlaceInfo'

interface Props extends FormProps {
  edit?: boolean
  enteringDate?: string
  onSetUser?: any
  initialPlace?: PlaceModel
}

export const IndividualBookingForm = reduxForm<BookingCreateForm, Props>({
  form: 'autoBooking',
  enableReinitialize: true,
})((props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    invalid,
    response,
    change,
    initialPlace,
    edit,
  } = props

  const matchSm = useMediaQuery((theme: any) => theme.breakpoints.up('md'))
  const comboRateQuery = useGetAllComboRateQuery(null)
  const { t } = useTranslation()

  //   const { data: roomInfo } = useGetRoomByPlaceIdQuery(
  //     initialPlace ? initialPlace.id : 0
  //   )
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

  //   const handleSetUser = (user: CaseSearchItem) => {
  //     onSetUser({
  //       ...user,
  //       patrName: user.partName,
  //       ...(user.fundingSource && { sourceFunding: user.fundingSource }),
  //     })
  //   }

  const handleExternalUserSelect = (exUser: CaseSearchNewItem) => {
    change('name', exUser.name)
    change('surname', exUser.surname)
    change('patronymicName', exUser.partName)
    change('individualId', exUser.individualId)
    change('dob', exUser.dob)
    change('gender', exUser.gender)
    change('phoneNumber', exUser.phoneNumber)
  }

  useEffect(() => {
    console.log(initialPlace)
  }, [initialPlace])

  return (
    <>
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
                  validate={[validators.required]}
                >
                  {statusOfBookingOptionsFn().map(([k, l]) => (
                    <MenuItem value={k} key={k}>
                      {l}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  name="sourceFunding"
                  label={t('Funding')}
                  component={renderSelectField}
                  required
                  validate={[validators.required]}
                >
                  {sourceFundingOptionsFn().map(([k, l]) => (
                    <MenuItem value={k} key={k}>
                      {l}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  name="comboRateId"
                  label={t('Combo rate')}
                  component={renderSelectField}
                >
                  <MenuItem value="">
                    <em>{t('None')}</em>
                  </MenuItem>
                  {comboRateQuery.data &&
                    comboRateQuery.data.map((combo) => (
                      <MenuItem value={combo.id} key={combo.id}>
                        <ListItemText>{combo.description}</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                          {combo.totalRate}
                        </Typography>
                      </MenuItem>
                    ))}
                </Field>
              </Stack>
              <DateRangeFields form="autoBooking" change={change} edit={edit} />
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
              <Field name="sendById" component={CompanySelectorField} />
            </Stack>
          </Paper>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {t('User')}
            </Typography>
            <Stack spacing={3}>
              <CasesExternalSearch onSelect={handleExternalUserSelect} />
              <Stack
                spacing={3}
                direction={matchSm ? 'row' : 'column'}
                width="100%"
              >
                <Field
                  name="name"
                  label={t('Name')}
                  component={renderTextField}
                />
                <Field
                  name="surname"
                  label={t('Surname')}
                  component={renderTextField}
                />
                <Field
                  name="patronymicName"
                  label={t('Middle name')}
                  component={renderTextField}
                />
              </Stack>
              <Stack
                spacing={3}
                direction={matchSm ? 'row' : 'column'}
                width="100%"
              >
                <Field
                  name="dob"
                  label={t('Birth Date')}
                  component={renderTextField}
                  {...dateMask}
                />
                <Field
                  name="gender"
                  label={t('Gender')}
                  component={renderSelectField}
                >
                  <MenuItem value="">
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value="MALE">{t('Male')}</MenuItem>
                  <MenuItem value="FEMALE">{t('Female')}</MenuItem>
                </Field>
              </Stack>
              <Stack
                spacing={3}
                direction={matchSm ? 'row' : 'column'}
                width="100%"
              >
                <Field
                  name="individualId"
                  label={t('Individual ID')}
                  component={renderTextField}
                />
                <Field
                  name="phoneNumber"
                  label={t('Phone')}
                  component={renderTextField}
                  {...phoneMask}
                />
              </Stack>
              <Stack
                spacing={3}
                direction={matchSm ? 'row' : 'column'}
                width="100%"
              >
                <Field
                  name="email"
                  label={t('Email')}
                  type="email"
                  component={renderTextField}
                  validate={[validators.email]}
                />
                <Field
                  name="note"
                  label={t('Note')}
                  component={renderTextField}
                />
              </Stack>
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
    </>
  )
})
