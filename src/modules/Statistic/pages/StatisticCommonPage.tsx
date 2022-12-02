import { Grid, Typography } from '@mui/material'
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
      </Grid>
    </>
  )
}
