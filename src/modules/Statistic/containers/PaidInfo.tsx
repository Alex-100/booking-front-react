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
import { dailyStatValues, dailyStatValuesFn } from 'modules/Dashboard/constants'
import { useTranslation } from 'react-i18next'
import { LabelModel } from 'types'
import { DailyStatModel } from '../types/DailyStatModel'

interface PaidInfoProps {
  title: string
  total?: DailyStatModel
  containerList?: {
    label: LabelModel
    totalDailyStat: DailyStatModel
  }[]
}

export const PaidInfo = ({
  title,
  containerList,
  total,
}: PaidInfoProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Grid item lg={12} xs={12} md={12} sm={12}>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1, mt: 3 }}>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Place type')}</TableCell>
              {dailyStatValuesFn().map(({ key, label }) => (
                <TableCell key={key}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {containerList &&
              containerList.map((info) => (
                <TableRow key={info.label.id}>
                  <TableCell>{info.label.name}</TableCell>
                  {dailyStatValues.map(({ key }) => (
                    <TableCell key={key}>{info.totalDailyStat[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            {total && (
              <TableRow>
                <TableCell>{t('Total')}</TableCell>
                {dailyStatValues.map(({ key }) => (
                  <TableCell key={key}>{total[key]}</TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
