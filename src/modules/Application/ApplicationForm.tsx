import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Stack from '@mui/material/Stack'
import { renderSelectField, renderTextField } from '../../components/redux-form'
import LoadingButton from '@mui/lab/LoadingButton'
import { FormProps } from '../../components/redux-form/types'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ApplicationModel } from './types'
import { validators } from '../../utils'
import { MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { timeMask } from 'utils/masks'

const ApplicationForm = reduxForm<ApplicationModel, FormProps>({
  form: 'applicationForm',
})((props) => {
  const { handleSubmit, pristine, submitting, invalid, response } = props
  const matches = useMediaQuery((theme: any) => theme.breakpoints.up('sm'))

  const { t } = useTranslation()

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={3}
        width={matches ? 350 : undefined}
      >
        <Field
          name="nameOfAppTitle"
          label={t('Name of app title')}
          component={renderTextField}
        />
        <Field
          name="nameOfAppSubtitle"
          label={t('Name of app subtitle')}
          component={renderTextField}
        />
        <Field
          name="footerText"
          label={t('Footer text')}
          component={renderTextField}
        />
        <Field
          name="defaultCurrency"
          label={t('Default currency')}
          component={renderSelectField}
          required
          validate={[validators.required]}
        >
          <MenuItem value="EURO">{t('EURO')}</MenuItem>
          <MenuItem value="DOLLAR">{t('DOLLAR')}</MenuItem>
          <MenuItem value="POUND_STERLING">{t('POUND_STERLING')}</MenuItem>
          <MenuItem value="JAPAN_YEN">{t('JAPAN_YEN')}</MenuItem>
          <MenuItem value="ROUBLE">{t('ROUBLE')}</MenuItem>
        </Field>
        <Field
          name="externalApiConnectorString"
          label={t('External API connector string')}
          component={renderTextField}
          disabled
        />
        <Field
          name="externalApiUsername"
          label={t('External API username')}
          autoComplete="new-password"
          component={renderTextField}
        />
        <Field
          name="externalApiPassword"
          label={t('External API password')}
          autoComplete="new-password"
          type="password"
          component={renderTextField}
        />
        <Field
          name="timeDefaultEntering"
          component={renderTextField}
          label={t('Entering time')}
          required
          validate={[validators.required, validators.isTime]}
          {...timeMask}
        />
        <Field
          name="timeDefaultLeaving"
          label={t('Leaving time')}
          required
          component={renderTextField}
          validate={[validators.required, validators.isTime]}
          {...timeMask}
        />
        <LoadingButton
          variant="outlined"
          type="submit"
          disabled={invalid || pristine || submitting}
          loading={response.status === 'pending'}
          loadingPosition="center"
          sx={{ width: '120px' }}
        >
          {t('Save')}
        </LoadingButton>
      </Stack>
    </form>
  )
})

export default ApplicationForm
