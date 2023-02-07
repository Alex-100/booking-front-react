import { TextField } from '@mui/material'
import { useDebounce } from 'hooks'
import { setSearch } from 'modules/Booking/state/bookingFiltersSlice'
import { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export const SearchContainer: React.FC = () => {
  const { t } = useTranslation()
  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  const dispatch = useAppDispatch()

  const [typedValue, setTypedValue] = useState('')
  const val = useDebounce(typedValue, 500)

  useEffect(() => {
    dispatch(setSearch(val))
  }, [val])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { value },
    } = event
    setTypedValue(value)
  }

  return (
    <TextField
      label={t('Search')}
      size="small"
      variant="outlined"
      onChange={handleChange}
      defaultValue={bookingFilters.text}
      sx={{ pr: 2 }}
    />
  )
}
