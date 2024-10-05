import EventIcon from '@mui/icons-material/Event'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
} from '@mui/material'
import format from 'date-fns/format'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarPicker, LocalizationProvider } from '@mui/x-date-pickers'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'

import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface DatePickerProps {
  value: Date
  onDateSelect: (date: Date) => void
}

export const DatePicker = ({ value, onDateSelect }: DatePickerProps) => {
  const { t, i18n } = useTranslation()

  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    setDisplayValue(
      format(value, i18n.language === 'ru' ? 'dd.MM.yyyy' : 'yyyy-MM-dd')
    )
  }, [value, i18n.language])

  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null)
  const inpuRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    setAnchorEl(inpuRef.current)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleDateSelect = (date: Dayjs | null) => {
    if (date) {
      // setSelectedDate(date.d)
      onDateSelect(date.toDate())
      console.log(date.toDate())
      handleClose()
    }
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 140 }} variant="outlined" fullWidth>
      <InputLabel htmlFor="outlined-adornment-password">{t('Date')}</InputLabel>
      <OutlinedInput
        ref={inpuRef}
        type={'text'}
        value={displayValue}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              edge="end"
              onClick={handleClick}
            >
              <EventIcon />
            </IconButton>
          </InputAdornment>
        }
        label={t('Date')}
      />

      <Popover
        // id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <CalendarPicker date={dayjs(value)} onChange={handleDateSelect} />
        </LocalizationProvider>

        {/* <StaticDatePicker value={value} onChange={(v) => console.log(v)}  /> */}
      </Popover>
    </FormControl>
  )
}
