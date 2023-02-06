// @ts-nocheck
import { Chip, Stack, styled, TextField, useMediaQuery } from '@mui/material'
import addDays from 'date-fns/addDays'
import formatISO from 'date-fns/formatISO'
import isMatch from 'date-fns/isMatch'
import parseISO from 'date-fns/parseISO'
import { DAYS_INCREMENT_OPTIONS } from 'modules/Booking/constants'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputMask from 'react-input-mask'
import { validators } from 'utils'

const StyledTextField = styled(TextField)(() => ({
  '& .MuiFormLabel-asterisk': {
    color: 'red',
  },
}))

interface DateRangeSelectorProps {
  enteringDate: string
  leavingDate: string
  onEnteringDateChange: (value: string) => void
  onLeaveDateChange: (value: string) => void
}

export const DateRangeSelector = ({
  enteringDate,
  leavingDate,
  onEnteringDateChange,
  onLeaveDateChange,
}: DateRangeSelectorProps) => {
  const matchSm = useMediaQuery((theme: any) => theme.breakpoints.up('md'))
  const { t } = useTranslation()

  const [enteringTimeVal, setEnteringTimeVal] = useState('00:00')
  const [leavingTimeVal, setLeavingTimeVal] = useState('00:00')

  const [enteringDateVal, setEnteringDateVal] = useState('')
  const [leavingDateVal, setLeavingDateVal] = useState('')

  useEffect(() => {
    if (enteringDate && enteringDate.split(' ')) {
      const dateS = enteringDate.split(' ')
      setEnteringDateVal(dateS[0])
      //   setEnteringTimeVal(dateS[1])
    }
  }, [enteringDate])

  useEffect(() => {
    if (leavingDate && leavingDate.split(' ')) {
      const dateS = leavingDate.split(' ')
      setLeavingDateVal(dateS[0])
    }
  }, [leavingDate])

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
    const d = `${enteringDateVal} ${enteringTimeVal}`
    if (isMatch(d, 'yyyy-MM-dd HH:mm')) {
      onEnteringDateChange(d)
    } else {
      onEnteringDateChange('')
    }
  }, [enteringDateVal, enteringTimeVal])

  useEffect(() => {
    const d = `${leavingDateVal} ${leavingTimeVal}`
    console.log('L DATE', d, isMatch(d, 'yyyy-MM-dd HH:mm'))
    if (isMatch(d, 'yyyy-MM-dd HH:mm')) {
      onLeaveDateChange(d)
    } else {
      onLeaveDateChange('')
    }
  }, [leavingDateVal, leavingTimeVal])

  return (
    <>
      <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
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
                <TextField
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
            {(props) => (
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
    </>
  )
}
