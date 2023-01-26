import { Grid, Paper, Toolbar, Typography } from '@mui/material'
import format from 'date-fns/format'
import { UsersBookingStatBriefContainer } from 'modules/Dashboard/containers/UsersBookingStatBriefContainer'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateRangeSelector } from '../components/DateRangeSelector'

export const StatisticUsersBriefPage = () => {
  const { t } = useTranslation()

  const [enteringDate, setEnteringDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd HH-mm')
  )
  const [leavingDate, setLeavingDate] = useState<string>('')

  const handleEnteringDateChange = (value: string) => {
    setEnteringDate(value)
  }

  const handleLeavingDateChange = (value: string) => {
    setLeavingDate(value)
  }

  useEffect(() => {
    console.log(
      'DATES',
      enteringDate,
      leavingDate,
      format(new Date(), 'yyyy-MM-dd HH-mm')
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
          <DateRangeSelector
            enteringDate={enteringDate}
            leavingDate={leavingDate}
            onEnteringDateChange={handleEnteringDateChange}
            onLeaveDateChange={handleLeavingDateChange}
          />
        </Toolbar>

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
