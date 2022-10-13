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
import { CaseSearchItem } from 'modules/Booking/state/externalSearchService'

interface Props extends FormProps {
  edit?: boolean
  enteringDate?: string
  onSetUser?: any
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
  } = props

  const matchSm = useMediaQuery((theme: any) => theme.breakpoints.up('md'))
  const comboRateQuery = useGetAllComboRateQuery(null)
  const { t } = useTranslation()

  //   const handleSetUser = (user: CaseSearchItem) => {
  //     onSetUser({
  //       ...user,
  //       patrName: user.partName,
  //       ...(user.fundingSource && { sourceFunding: user.fundingSource }),
  //     })
  //   }

  const handleExternalUserSelect = (exUser: CaseSearchItem) => {
    change('name', exUser.name)
    change('surname', exUser.surname)
    change('patronymicName', exUser.partName)
    change('individualId', exUser.individualId)
    change('dob', exUser.dob)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={4}
          width={!matchSm ? 250 : 640}
        >
          <Paper sx={{ p: 2, width: '100%' }} variant="outlined">
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {t('Common')}
            </Typography>
            <Stack spacing={3}>
              <Field name="placeId" component={PlaceSelector} />

              <Field
                name="userId"
                component={UserSelectorField}
                required
                validate={[validators.required]}
              />
              <Field name="sendById" component={CompanySelectorField} />
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
              <DateRangeFields form="autoBooking" />
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
                  disabled
                  component={renderTextField}
                />
                <Field
                  name="surname"
                  label={t('Surname')}
                  disabled
                  component={renderTextField}
                />
                <Field
                  name="patronymicName"
                  label={t('Middle name')}
                  disabled
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
                  disabled
                  component={renderTextField}
                  {...dateMask}
                />
                <Field
                  name="individualId"
                  label={t('Individual ID')}
                  disabled
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
