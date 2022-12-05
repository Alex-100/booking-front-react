import { Grid, Typography } from '@mui/material'
import DailyStatContainer from 'modules/Dashboard/containers/DailyStatContainer'
import { useTranslation } from 'react-i18next'

export const StatisticCommonPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.common')}
          </Typography>
        </Grid>
        <Grid item lg={12} xs={12} md={12} sm={12}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, mt: 3 }}>
            {t('Daily')}
          </Typography>
          <DailyStatContainer />
        </Grid>
      </Grid>
    </>
  )
}
