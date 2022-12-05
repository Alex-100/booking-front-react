import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material'
import { dailyStatValues, dailyStatValuesFn } from 'modules/Dashboard/constants'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAllDepartmentsQuery, useGetAllHospitalsQuery } from 'services'
import { useAppSelector } from 'store'
import { useGetDailyStatForHospitalNQuery } from '../services/statisticServiceN'

export const StatisticDepartmentPage = (): JSX.Element => {
  const { t } = useTranslation()
  const d = useAppSelector((state) => state.dailyStatFilters)

  const [selectedHospital, setSelectedHospital] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState(0)

  const { data: hospitals } = useGetAllHospitalsQuery(null)
  const handleHospitalSelect = (event: SelectChangeEvent) => {
    setSelectedHospital(event.target.value)
  }
  const handleDepartmentSelect = (event: SelectChangeEvent) => {
    setSelectedDepartment(Number(event.target.value))
  }

  const { data: departments } = useGetAllDepartmentsQuery({ page: 0 })

  const { data } = useGetDailyStatForHospitalNQuery({
    date: d.date,
    departmentId: selectedDepartment,
  })

  const hospitalsData = useMemo(() => {
    if (data) {
      return Array.isArray(data) ? data : [{ ...data }]
    } else {
      return undefined
    }
  }, [data])

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.department')}
          </Typography>
        </Grid>

        <Toolbar sx={{ sm: 6, py: 1, my: 1, width: '100%' }} component={Paper}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>{t('Hospital')}</InputLabel>
            <Select
              label={t('Hospital')}
              value={selectedHospital}
              onChange={handleHospitalSelect}
            >
              <MenuItem value={''}>
                <em>{t('None')}</em>
              </MenuItem>
              {hospitals?.map((hospital) => (
                <MenuItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 140 }}>
            <InputLabel>{t('Department')}</InputLabel>
            <Select
              label={t('Department')}
              value={String(selectedDepartment)}
              onChange={handleDepartmentSelect}
            >
              <MenuItem value="">
                <em>{t('None')}</em>
              </MenuItem>
              {departments?.content.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
        <Grid item lg={12} xs={12} md={12} sm={12}>
          {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>{t('Hospital')}</InputLabel>
            <Select label={t('Hospital')}>
              {hospitals?.map((hospital) => (
                <MenuItem key={hospital.id}>{hospital.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Select label={t('Department')}></Select> */}
        </Grid>

        <Grid item lg={12} xs={12} md={12} sm={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('ID')}</TableCell>
                  <TableCell>{t('Hospital')}</TableCell>
                  <TableCell>{t('Department')}</TableCell>
                  {dailyStatValuesFn().map(({ key, label }) => (
                    <TableCell key={key}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {hospitalsData &&
                  hospitalsData.map((row) => (
                    <TableRow
                      key={row.department.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" width={70}>
                        {row.department.id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.hospital.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.department.name}
                      </TableCell>
                      {dailyStatValues.map(({ key }) => (
                        <TableCell key={key}>{row.dailyStat[key]}</TableCell>
                      ))}
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
