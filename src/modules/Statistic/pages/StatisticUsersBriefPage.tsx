import { Box, Grid, Paper, Toolbar, Typography } from '@mui/material'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import { UsersBookingStatBriefContainer } from 'modules/Dashboard/containers/UsersBookingStatBriefContainer'
import { DateRange } from 'mui-daterange-picker'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DateRangeContainer from '../components/DateRangeContainer'
// import { DateRangeSelector } from '../components/DateRangeSelector'

export const StatisticUsersBriefPage = () => {
  const { t } = useTranslation()

  const [enteringDate, setEnteringDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd HH:mm')
  )
  const [leavingDate, setLeavingDate] = useState<string>(
    format(addDays(new Date(), 6), 'yyyy-MM-dd HH:mm')
  )

//   const handleEnteringDateChange = (value: string) => {
//     setEnteringDate(value)
//   }

//   const handleLeavingDateChange = (value: string) => {
//     setLeavingDate(value)
//   }

  const handleRangeChange = (range: DateRange) => {
    // console.log('Selected dates', range)
    setEnteringDate(format(range.startDate || new Date(), 'yyyy-MM-dd HH:mm'))
    setLeavingDate(
      range.endDate ? format(range.endDate, 'yyyy-MM-dd HH:mm') : ''
    )
  }

  useEffect(() => {
    console.log(
      'DATES',
      enteringDate,
      leavingDate,
      format(new Date(), 'yyyy-MM-dd HH:mm')
    )
  }, [enteringDate, leavingDate])

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.users_brief')}
          </Typography>
        </Grid>
        <Grid item lg={12} xs={12} md={12} sm={12}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, mt: 3 }}>
            {t('Users booking stats')}
          </Typography>
        </Grid>

        <Toolbar sx={{ sm: 6, py: 2, my: 2, width: '100%' }} component={Paper}>
          <Box sx={{ flex: 1 }} />
          <DateRangeContainer
            enteringDate={enteringDate}
            leavingDate={leavingDate}
            onDatesChange={handleRangeChange}
          />
        </Toolbar>
        {/* <Toolbar sx={{ sm: 6, py: 2, my: 2, width: '100%' }} component={Paper}>
          <DateRangeSelector
            enteringDate={enteringDate}
            leavingDate={leavingDate}
            onEnteringDateChange={handleEnteringDateChange}
            onLeaveDateChange={handleLeavingDateChange}
          />
        </Toolbar> */}

        <Grid item lg={12} xs={12} md={12} sm={12}>
          <UsersBookingStatBriefContainer
            enteringDate={enteringDate}
            leavingDate={leavingDate}
          />
        </Grid>
      </Grid>
    </>
  )
}
