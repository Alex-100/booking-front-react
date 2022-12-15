import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGetStatForPlacesQuery } from '../services/statisticServiceN'

export const StatisticRoomsPage = () => {
  const { t } = useTranslation()
  const { data } = useGetStatForPlacesQuery(null)
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.rooms')}
          </Typography>
        </Grid>
        <Grid item lg={12} xs={12} md={12} sm={12} sx={{ mt: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Place type')}</TableCell>
                  <TableCell>{t('Rooms amount')}</TableCell>
                  <TableCell>{t('Places amount')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((info) => (
                    <TableRow key={info.label.id}>
                      <TableCell
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        {' '}
                        <div
                          style={{
                            width: '0.8rem',
                            height: '0.8rem',
                            borderRadius: '0.4rem',

                            backgroundColor: info.label.color,
                          }}
                        ></div>{' '}
                        {info.label.name}
                      </TableCell>
                      <TableCell>{info.roomsAmount}</TableCell>
                      <TableCell>{info.placesAmount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  )
}
