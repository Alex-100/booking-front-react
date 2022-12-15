import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
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
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  //   useGetAllDepartmentsQuery,
  useGetAllHospitalsQuery,
  useGetDepartmentsByHospitalQuery,
} from 'services'
import { useAppSelector } from 'store'
import { useGetDailyStatForHospitalNQuery } from '../services/statisticServiceN'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export const StatisticDepartmentPage = (): JSX.Element => {
  const { t } = useTranslation()
  const d = useAppSelector((state) => state.dailyStatFilters)

  const [selectedHospital, setSelectedHospital] = useState('')
  const [selectedDepartments, setSelectedDepartments] = useState<Array<string>>(
    []
  )

  const { data: hospitals } = useGetAllHospitalsQuery(null)
  const handleHospitalSelect = (event: SelectChangeEvent) => {
    setSelectedHospital(event.target.value)
  }
  const handleDepartmentSelect = (
    event: SelectChangeEvent<typeof selectedDepartments>
  ) => {
    const {
      target: { value },
    } = event
    setSelectedDepartments(typeof value === 'string' ? value.split(',') : value)
  }

  //   const { data: departments } = useGetAllDepartmentsQuery({ page: 0 })
  const { data: hospitalDepartments } = useGetDepartmentsByHospitalQuery({
    hospitalId: (selectedHospital as unknown) as number,
  })

  const availableHospitalDepartments = useMemo(
    () =>
      hospitalDepartments !== undefined
        ? hospitalDepartments.map((dep) => (dep.id as unknown) as string)
        : [],
    [hospitalDepartments]
  )

  const { data } = useGetDailyStatForHospitalNQuery({
    date: d.date,
    hospitalId: selectedHospital,
    departmentsId:
      selectedDepartments.length > 0
        ? selectedDepartments
        : availableHospitalDepartments.length > 0
        ? availableHospitalDepartments
        : undefined,
  })

  useEffect(() => {
    if (
      hospitalDepartments &&
      hospitalDepartments.length > 0 &&
      selectedHospital !== ''
    ) {
      setSelectedDepartments(
        hospitalDepartments.map(
          (department) => (department.id as unknown) as string
        )
      )
    } else {
      setSelectedDepartments([])
    }
  }, [hospitalDepartments, selectedHospital])

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
          <Grid container spacing={2}>
            <Grid item lg={6} xs={12} md={6} sm={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
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
            </Grid>
            <Grid item lg={6} xs={12} md={6} sm={12}>
              <FormControl
                sx={{ m: 1, minWidth: 140 }}
                fullWidth
                disabled={
                  !(hospitalDepartments && hospitalDepartments.length > 0) ||
                  selectedHospital === ''
                }
              >
                <InputLabel>{t('Department')}</InputLabel>
                <Select
                  label={t('Department')}
                  value={selectedDepartments}
                  onChange={handleDepartmentSelect}
                  multiple
                  input={<OutlinedInput label={t('Department')} />}
                  renderValue={(selected) =>
                    hospitalDepartments
                      ?.filter((department) =>
                        selected.includes((department.id as unknown) as string)
                      )
                      .map((v) => v.name)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                >
                  {hospitalDepartments?.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      <Checkbox
                        checked={
                          selectedDepartments.indexOf(
                            (department.id as unknown) as string
                          ) > -1
                        }
                      />
                      <ListItemText primary={department.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Toolbar>

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
                {(availableHospitalDepartments.length > 0 ||
                  selectedHospital === '') &&
                  hospitalsData &&
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
