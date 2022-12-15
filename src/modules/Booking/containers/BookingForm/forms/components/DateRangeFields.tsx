//@ts-nocheck

import React, { useEffect, useMemo, useState } from 'react'
import Stack from '@mui/material/Stack'
import { Field, formValueSelector } from 'redux-form'
import { renderTextField } from '../../../../../../components/redux-form'
import { validators } from '../../../../../../utils'
import { dateMask, timeMask } from '../../../../../../utils/masks'
import { DAYS_INCREMENT_OPTIONS } from '../../../../constants'
import Chip from '@mui/material/Chip'
import moment from 'moment'
import { DATE_FORMAT_TEMPLATE } from '../../../../../../constants'
import useMediaQuery from '@mui/material/useMediaQuery'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useGetApplicationQuery } from 'modules/Application/applicationService'

import { styled, TextField, TextFieldProps, Theme } from '@mui/material'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
import formatISO from 'date-fns/formatISO'
import InputMask from 'react-input-mask'
import { MUIStyledCommonProps } from '@mui/system'

const StyledTextField = styled(TextField)(() => ({
  '& .MuiFormLabel-asterisk': {
    color: 'red',
  },
}))

const DateRangeFields = ({
  enteringDate,
  leavingDate,
  leavingTime,
  change,
  edit,
}: {
  enteringDate?: string
  leavingDate?: string
  leavingTime: string
  change?: (field: string, value: any) => void
  edit?: boolean
}) => {
  const { t } = useTranslation()
  const matchSm = useMediaQuery((theme: any) => theme.breakpoints.up('md'))
  const applicationQuery = useGetApplicationQuery(null)

  const [timeDefaultLeaving, setTimeDefaultLeaving] = useState('00:00')
  const [timeDefaultEntering, setTimeDefaultEntering] = useState('00:00')

  const [isDefaultTimeLoaded, setIsDefaultTimeLoaded] = useState(false)
  const [isDefaultTimeSetted, setIsDefaultTimeSetted] = useState(false)

  const [enteringTimeVal, setEnteringTimeVal] = useState('00:00')
  const [leavingTimeVal, setLeavingTimeVal] = useState('00:00')

  const [enteringDateVal, setEnteringDateVal] = useState('')
  const [leavingDateVal, setLeavingDateVal] = useState('')

  useEffect(() => {
    // console.log('applicationQuery', applicationQuery)
    if (applicationQuery.data && applicationQuery.isSuccess) {
      setEnteringTimeVal(applicationQuery.data.timeDefaultEntering ?? '00:00')
      // setLeavingTimeVal(
      //   leavingTime ?? applicationQuery.data.timeDefaultLeaving ?? '00:00'
      // )

      // setTimeDefaultLeaving(applicationQuery.data.timeDefaultLeaving ?? '00:00')
      if (applicationQuery.data.timeDefaultLeaving) {
        setTimeDefaultLeaving(applicationQuery.data.timeDefaultLeaving)
      }
      if (applicationQuery.data.timeDefaultEntering) {
        setTimeDefaultEntering(applicationQuery.data.timeDefaultEntering)
      }
      setIsDefaultTimeLoaded(true)

      // console.log(enteringTimeVal, leavingTimeVal)
      // console.log('SET LEAVING TIME', leavingTimeVal, leavingTime)
    }
  }, [applicationQuery])

  useEffect(() => {
    if (isDefaultTimeLoaded && !isDefaultTimeSetted) {
      if (applicationQuery.isSuccess) {
        // console.log('Setting inials date')
        // console.log('Default leavingTime', timeDefaultLeaving)

        //   if (leavingDate) {
        //     const parsed = leavingDate.split(' ')
        //     if (parsed && parsed[0] && change) {
        //       change('leavingDateD', parsed[0])
        //     }
        //   }
        // console.log('enteringDate is ', enteringDate)

        if (leavingDate) {
          const parsed = leavingDate.split(' ')
          if (parsed && parsed[1]) setLeavingTimeVal(parsed[1])

          if (parsed && parsed[0]) setLeavingDateVal(parsed[0])
        } else {
          setLeavingTimeVal(timeDefaultLeaving)
        }

        if (enteringDate) {
          const parsed = enteringDate.split(' ')
          // console.log('enteringDate parsed is', parsed)
          if (parsed && parsed[1] && edit) setEnteringTimeVal(parsed[1])
          if (parsed && parsed[0]) setEnteringDateVal(parsed[0])
        } else setEnteringTimeVal(timeDefaultEntering)

        setIsDefaultTimeSetted(true)
      }
    }
  }, [
    timeDefaultLeaving,
    timeDefaultEntering,
    applicationQuery,
    isDefaultTimeLoaded,
    isDefaultTimeSetted,
  ])

  // useEffect(() => {
  //   console.log('DATES INITIAL', enteringDate, leavingDate, leavingTime)
  // }, [])

  // useEffect(() => {
  //   console.log('DATES CHANGED', enteringDate, leavingDate, leavingTime)
  // }, [enteringDate, leavingDate, leavingTime])

  // useEffect(() => {
  //   console.log('Parsing date', enteringDate, change)
  //   if (enteringDate) {
  //     const parsed = enteringDate.split(' ')
  //     if (parsed && parsed[0] && change) {
  //       change('enteringDateD', parsed[0])
  //     }
  //   }
  // }, [enteringDate, change])

  // useEffect(() => {
  //   if (edit) {
  //     if (enteringDate) {
  //       const parsed = enteringDate.split(' ')
  //       if (parsed && parsed[1] && change) {
  //         change('enteringTime', parsed[1])
  //       }
  //     }
  //   } else if (edit === false) {
  //     if (enteringTimeVal && change) {
  //       change('enteringTime', enteringTimeVal)
  //     }
  //   }
  // }, [edit, enteringDate, change, enteringTimeVal])

  // leavingDate

  // useEffect(() => {
  //   console.log('Parsing date leavingDate', leavingDate, change)
  //   if (leavingDate) {
  //     const parsed = leavingDate.split(' ')
  //     if (parsed && parsed[0] && change) {
  //       change('leavingDateD', parsed[0])
  //     }
  //   }
  // }, [leavingDate, change])

  // useEffect(() => {
  //   if (edit) {
  //     if (leavingDate) {
  //       const parsed = leavingDate.split(' ')
  //       if (parsed && parsed[1] && change) {
  //         change('leavingTime', parsed[1])
  //       }
  //     }
  //   } else if (edit === false) {
  //     if (leavingTimeVal && change) {
  //       change('leavingTime', leavingTimeVal)
  //     }
  //   }
  // }, [edit, leavingDate, change, leavingTimeVal])

  const handleTimeValChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('L TIME EDITED')
    const {
      target: { value },
    } = event
    setLeavingTimeVal(value)
  }

  const handleEnteringTimeValChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = event
    setEnteringTimeVal(value)
  }

  const handleEnteringDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = event
    setEnteringDateVal(value)
  }

  const handleLeavingDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = event
    setLeavingDateVal(value)
  }

  const leavingTimeValidator = useMemo(
    () =>
      validators.required(leavingTimeVal) || validators.isTime(leavingTimeVal),
    [leavingTimeVal]
  )
  const isErrorLeavingTimeValid = useMemo(() => Boolean(leavingTimeValidator), [
    leavingTimeValidator,
  ])

  const enteringTimeValidator = useMemo(
    () =>
      validators.required(enteringTimeVal) ||
      validators.isTime(enteringTimeVal),
    [enteringTimeVal]
  )
  const isErrorEnteringTimeValid = useMemo(
    () => Boolean(enteringTimeValidator),
    [enteringTimeValidator]
  )

  const enteringDateValidator = useMemo(
    () =>
      validators.required(enteringDateVal) ||
      validators.isDate(enteringDateVal),
    [enteringDateVal]
  )
  const isErrorEnteringDateValid = useMemo(
    () => Boolean(enteringDateValidator),
    [enteringDateValidator]
  )

  const leavingDateValidator = useMemo(
    () =>
      validators.required(leavingDateVal) || validators.isDate(leavingDateVal),
    [leavingDateVal]
  )
  const isErrorLeavingDateValid = useMemo(() => Boolean(leavingDateValidator), [
    leavingDateValidator,
  ])

  useEffect(() => {
    if (leavingTimeVal && !isErrorLeavingTimeValid && change) {
      change('leavingTime', leavingTimeVal)
      // change('leavingDateD', parsed[0])
      // console.log('CHANGE LEAVE TIME', leavingTimeVal, leavingTime)
    }
    if (leavingTime && isErrorLeavingTimeValid && change) {
      change('leavingTime', '')
    }
  }, [leavingTimeVal, isErrorLeavingTimeValid, change])

  useEffect(() => {
    // console.log('enteringTime', enteringTimeVal, isErrorEnteringTimeValid)
    if (enteringTimeVal && !isErrorEnteringTimeValid && change) {
      change('enteringTime', enteringTimeVal)
    }
    if (enteringTimeVal && isErrorEnteringTimeValid && change) {
      change('enteringTime', '')
    }
  }, [enteringTimeVal, isErrorEnteringTimeValid, change])

  useEffect(() => {
    // console.log('enteringDateD', enteringDateVal)
    if (enteringDateVal && !isErrorEnteringDateValid && change)
      change('enteringDateD', enteringDateVal)
    if (enteringDateVal && isErrorEnteringDateValid && change)
      change('enteringDateD', '')
  }, [enteringDateVal, isErrorEnteringDateValid, change])

  useEffect(() => {
    // console.log('leavingDateD', leavingDateVal, isErrorLeavingDateValid)
    if (leavingDateVal && !isErrorLeavingDateValid && change)
      change('leavingDateD', leavingDateVal)
    if (leavingDateVal && isErrorLeavingDateValid && change)
      change('leavingDateD', '')
  }, [leavingDateVal, isErrorLeavingDateValid, change])
  // useEffect(() => {
  //   console.log('CURRENT LEAVE TIME', leavingTime)
  // }, [leavingTime])

  useEffect(() => {
    if (isDefaultTimeSetted) {
      // console.log('EDITING DATES B', enteringDateVal, enteringTimeVal)

      if (
        change &&
        enteringDateVal &&
        enteringTimeVal &&
        !isErrorEnteringDateValid &&
        !isErrorEnteringTimeValid
      )
        change('enteringDate', `${enteringDateVal} ${enteringTimeVal}`)
      if (change && (isErrorEnteringDateValid || isErrorEnteringTimeValid))
        change('enteringDate', '')
    }
  }, [
    enteringDateVal,
    enteringTimeVal,
    isErrorEnteringDateValid,
    isErrorEnteringTimeValid,
  ])

  useEffect(() => {
    if (isDefaultTimeSetted) {
      // console.log('EDITING DATES')

      if (
        change &&
        leavingDateVal &&
        leavingTimeVal &&
        !isErrorLeavingDateValid &&
        !isErrorLeavingTimeValid
      )
        change('leavingDate', `${leavingDateVal} ${leavingTimeVal}`)
      if (change && (isErrorLeavingDateValid || isErrorLeavingTimeValid))
        change('leavingDate', '')
    }
  }, [
    leavingDateVal,
    leavingTimeVal,
    isErrorLeavingDateValid,
    isErrorLeavingTimeValid,
  ])

  // useEffect(() => {
  //   console.log('ACTUAL leavingDate', leavingDate)
  // }, [leavingDate])

  return (
    <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
      <Stack
        direction={!matchSm ? 'column' : 'row'}
        sx={{ display: 'none' }}
        spacing={2}
      >
        <Field
          name="enteringDateD"
          label={t('Entering date')}
          required
          component={renderTextField}
          validate={[validators.required, validators.isDate]}
          {...dateMask}
        />
        <Field
          name="enteringTime"
          label={t('Entering time')}
          required
          component={renderTextField}
          validate={[validators.required, validators.isTime]}
          {...timeMask}
        />
      </Stack>

      <Stack
        direction={!matchSm ? 'column' : 'row'}
        sx={{ display: 'none' }}
        spacing={1}
      >
        <Stack spacing={1}>
          <Field
            name="leavingDateD"
            label={t('Leaving date')}
            required
            component={renderTextField}
            validate={[validators.required, validators.isDate]}
            {...dateMask}
          />

          <Field
            name="leavingDate"
            validate={[validators.required]}
            component={({ input }: any) => (
              <Stack direction="row" spacing={1}>
                {DAYS_INCREMENT_OPTIONS.map((d) => (
                  <Chip
                    key={d}
                    label={`${d}${t('d')}`}
                    size="small"
                    onClick={() => {
                      input.onChange(
                        moment(enteringDate)
                          .add(d, 'days')
                          .format(DATE_FORMAT_TEMPLATE)
                      )
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}
          />
        </Stack>

        <Field
          name="leavingTime"
          label={t('Leaving time')}
          hidden={true}
          required
          component={renderTextField}
          validate={[validators.required, validators.isTime]}
          {...timeMask}
        />
      </Stack>

      <Stack direction={!matchSm ? 'column' : 'row'} spacing={1}>
        <InputMask
          mask={'9999-99-99'}
          required
          label={t('Entering date')}
          placeholder={t('Entering date')}
          value={enteringDateVal}
          onChange={handleEnteringDateChange}
        >
          {(props) => (
            <StyledTextField
              {...props}
              fullWidth
              error={isErrorEnteringDateValid}
              helperText={enteringDateValidator}
            />
          )}
        </InputMask>

        <InputMask
          mask={'99:99'}
          required
          label={t('Entering time')}
          placeholder={t('Entering time')}
          value={enteringTimeVal}
          onChange={handleEnteringTimeValChange}
        >
          {(props) => (
            <StyledTextField
              {...props}
              fullWidth
              error={isErrorEnteringTimeValid}
              helperText={enteringTimeValidator}
            />
          )}
        </InputMask>
      </Stack>

      <Stack direction={!matchSm ? 'column' : 'row'} spacing={1}>
        <Stack>
          <InputMask
            mask={'9999-99-99'}
            required
            label={t('Leaving date')}
            placeholder={t('Leaving date')}
            value={leavingDateVal}
            onChange={handleLeavingDateChange}
          >
            {(props) => (
              <StyledTextField
                {...props}
                fullWidth
                error={isErrorLeavingDateValid}
                helperText={leavingDateValidator}
              />
            )}
          </InputMask>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {DAYS_INCREMENT_OPTIONS.map((d) => (
              <Chip
                key={d}
                label={`${d}${t('d')}`}
                size="small"
                onClick={() => {
                  const date = parseISO(enteringDateVal)
                  const dateP = addDays(date, d)
                  setLeavingDateVal(formatISO(dateP).slice(0, 10))
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Stack>

        <InputMask
          required
          placeholder={t('Leaving time')}
          value={leavingTimeVal}
          onChange={handleTimeValChange}
          label={t('Leaving time')}
          mask={'99:99'}
        >
          {(
            props: JSX.IntrinsicAttributes &
              React.PropsWithChildren<
                (TextFieldProps & MUIStyledCommonProps<Theme>) & {}
              >
          ) => (
            <StyledTextField
              {...props}
              fullWidth
              error={isErrorLeavingTimeValid}
              helperText={leavingTimeValidator}
            />
          )}
        </InputMask>
      </Stack>
    </Stack>
  )
}

export default connect((state, props: any) => {
  const enteringDate = formValueSelector(props.form)(state, 'enteringDate')
  const leavingDate = formValueSelector(props.form)(state, 'leavingDate')
  const leavingTime = formValueSelector(props.form)(state, 'leavingTime')
  // const fieldsVal = formValueSelector(props.form)(state)

  return {
    enteringDate,
    leavingDate,
    leavingTime,
  }
})(DateRangeFields)
