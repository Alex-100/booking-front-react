import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const StatisticUsersPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.users')}
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}
