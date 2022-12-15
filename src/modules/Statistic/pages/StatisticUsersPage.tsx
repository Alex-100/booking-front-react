import { Grid, Typography } from '@mui/material'
import UsersBookingStatContainer from 'modules/Dashboard/containers/UsersBookingStatContainer'
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
        <Grid item lg={12} xs={12} md={12} sm={12}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, mt: 3 }}>
            {t('Users booking stats')}
          </Typography>
          <UsersBookingStatContainer />
        </Grid>
      </Grid>
    </>
  )
}
