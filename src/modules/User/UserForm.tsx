import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Stack from '@mui/material/Stack'
import {
  renderMultiSelectField,
  renderSelectField,
  renderTextField,
} from '../../components/redux-form'
import { validators } from '../../utils'
import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'
import { useGetAllRolesQuery } from '../Role/role'
import { UserModel } from '../../types'
import { FormProps } from '../../components/redux-form/types'
import useMediaQuery from '@mui/material/useMediaQuery'
import DepartmentField from '../../fields/DepartmentField'
import { dateMask } from '../../utils/masks'
import { useTranslation } from 'react-i18next'
import { UserExternalSearch } from './UserExternalSearch'
import { EmployeeItem } from 'modules/Booking/state/externalSearchService'

const UserForm = reduxForm<UserModel, FormProps>({
  form: 'user',
})((props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    response,
    invalid,
    initialValues,
    change,
  } = props
  const { data } = useGetAllRolesQuery(null)
  const matches = useMediaQuery((theme: any) => theme.breakpoints.up('sm'))
  const { t } = useTranslation()

  const handleExternalUserSelect = (extUser: EmployeeItem) => {
    change('name', extUser.name)
    change('surname', extUser.surname)
    change('patrName', extUser.patrName)
    change('individualId', extUser.individualId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={matches ? 3 : 2}
        width={matches ? 600 : 250}
      >
        <UserExternalSearch onSelect={handleExternalUserSelect} />{' '}
        <Stack spacing={2} direction={matches ? 'row' : 'column'} width="100%">
          <Field
            name="name"
            label={t('Employe_Name')}
            component={renderTextField}
          />
          <Field
            name="surname"
            label={t('Surname')}
            component={renderTextField}
          />
          <Field
            name="patrName"
            label={t('Middle name')}
            component={renderTextField}
          />
        </Stack>
        <Stack spacing={3} direction={matches ? 'row' : 'column'} width="100%">
          <Field
            name="dob"
            label={t('Birth Date')}
            component={renderTextField}
            {...dateMask}
          />
          <Field name="individualId" label="IID" component={renderTextField} />
          <Field
            name="gender"
            label={t('Gender')}
            component={renderSelectField}
          >
            <MenuItem value="MALE">{t('Male')}</MenuItem>
            <MenuItem value="FEMALE">{t('Female')}</MenuItem>
          </Field>
        </Stack>
        <Stack spacing={3} direction={matches ? 'row' : 'column'} width="100%">
          <Field
            name="username"
            label={t('Username')}
            component={renderTextField}
            required
            validate={[validators.required]}
          />
          <Field
            name="password"
            label={t('Password')}
            type="password"
            component={renderTextField}
            {...(!initialValues ? { required: true } : {})}
            validate={!initialValues && [validators.required]}
          />
        </Stack>
        <Stack spacing={3} direction={matches ? 'row' : 'column'} width="100%">
          <Field
            name="roles"
            label={t('Roles')}
            placeholder={t('Add role')}
            component={renderMultiSelectField}
            required
            validate={[validators.required]}
          >
            {data &&
              data.map((role) => (
                <MenuItem key={role.id} value={JSON.stringify(role)}>
                  {role.name}
                </MenuItem>
              ))}
          </Field>
          <DepartmentField />
        </Stack>
        <LoadingButton
          variant="outlined"
          type="submit"
          disabled={invalid || pristine || submitting}
          loading={response.status === 'pending'}
          loadingPosition="center"
        >
          {t('Save')}
        </LoadingButton>
      </Stack>
    </form>
  )
})

export default UserForm
