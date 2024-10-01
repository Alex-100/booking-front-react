import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { useAppDispatch, useAppSelector } from '../../../../store'
import { BookingSearchParams } from '../../types/BookingSearchParams'
import {
  clearRoomFilter,
  loadInitialStateFilter,
  setFilters,
} from '../../state/bookingFiltersSlice'
import FiltersForm from './FiltersForm'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onClose(): void
}

const FiltersFormContainer: React.FC<Props> = ({ open, onClose }) => {
  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  const dispatch = useAppDispatch()

  const handleSubmitFilters = (
    filters: Omit<BookingSearchParams, 'enteringDateTo' | 'enteringDateFrom'>
  ) => {
    dispatch(clearRoomFilter())
    dispatch(setFilters(filters))
    onClose()
  }
  const { t } = useTranslation()

  useEffect(() => {
    const loadedFlters = loadInitialStateFilter()
    dispatch(setFilters({ ...bookingFilters, ...loadedFlters }))
  }, [])

  return (
    <Dialog
      onClose={onClose}
      maxWidth="lg"
      open={open}
      sx={{ overflow: 'visible' }}
    >
      <DialogTitle>{t('Filters')}</DialogTitle>
      <DialogContent sx={{ overflow: 'visible' }}>
        <FiltersForm
          onSubmit={handleSubmitFilters}
          initialValues={bookingFilters}
        />
      </DialogContent>
    </Dialog>
  )
}

export default FiltersFormContainer
