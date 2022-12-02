import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const StatisticPaidPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.pay')}
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}
