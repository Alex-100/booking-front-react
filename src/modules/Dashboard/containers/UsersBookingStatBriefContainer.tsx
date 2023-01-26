import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getUserShortName } from 'utils'
import { useGetUsersBookingBriefStatQuery } from '../services/statisticService'

interface UsersBookingStatBriefContainerProps {
  enteringDate: string
  leavingDate: string
}

export const UsersBookingStatBriefContainer: React.FC<UsersBookingStatBriefContainerProps> = ({
  enteringDate,
  leavingDate,
}) => {
  const { t } = useTranslation()
  const { data } = useGetUsersBookingBriefStatQuery({
    entering: enteringDate,
    leaving: leavingDate,
  })

  if (
    enteringDate === '' ||
    leavingDate === '' ||
    (data && data.length === 0)
  ) {
    return (
      <Typography variant="caption" color="text.secondary">
        {t('No users stats')}
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('ID')}</TableCell>
            <TableCell>{t('Name')}</TableCell>
            <TableCell>{t('Bookings size')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow
                key={row.user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" width={70}>
                  {row.user.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {getUserShortName(row.user)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.bookingsSize}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
