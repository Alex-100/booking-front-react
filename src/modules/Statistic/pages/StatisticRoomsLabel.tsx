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
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  //   useGetAllDepartmentsQuery,
  useGetAllHospitalsQuery,
  useGetAllLabelsQuery,
  useGetDepartmentsByHospitalQuery,
} from 'services'
import { useAppDispatch, useAppSelector } from 'store'
import { useGetDailyStatForHospitalByLabelQuery } from '../services/statisticServiceN'
import { FreePlaceInfo } from '../components/FreePlaceInfo'
import { filterByRoom } from 'modules/Booking/state/bookingFiltersSlice'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import { useHistory } from 'react-router-dom'

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

export const StatisticRoomsLabelPage = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useHistory()
  const dispatch = useAppDispatch()
  const d = useAppSelector((state) => state.dailyStatFilters)

  const [selectedHospital, setSelectedHospital] = useState('')
  const [selectedDepartments, setSelectedDepartments] = useState<Array<string>>(
    []
  )

  const { data: labels } = useGetAllLabelsQuery(null)
  const [selectedLabels, setSelectedLabels] = useState<Array<string>>([])
  const handleLabeltSelect = (
    event: SelectChangeEvent<typeof selectedLabels>
  ) => {
    const {
      target: { value },
    } = event
    setSelectedLabels(typeof value === 'string' ? value.split(',') : value)
  }

  const [period, setPeriod] = useState('24')

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
  const { data: hospitalDepartments } = useGetDepartmentsByHospitalQuery(
    {
      hospitalId: (selectedHospital as unknown) as number,
    },
    { skip: selectedHospital === '' }
  )

  const availableHospitalDepartments = useMemo(
    () =>
      hospitalDepartments !== undefined
        ? hospitalDepartments.map((dep) => (dep.id as unknown) as string)
        : [],
    [hospitalDepartments]
  )

  const { data, isSuccess } = useGetDailyStatForHospitalByLabelQuery(
    {
      date: d.date,
      departmentsId:
        selectedDepartments.length > 0
          ? selectedDepartments
          : availableHospitalDepartments.length > 0
          ? availableHospitalDepartments
          : [],
      labelsId: selectedLabels,
      hoursBetweenEnteringAndLeaving: +period,
    },
    {
      skip: selectedDepartments.length === 0 || selectedLabels.length === 0,
    }
    // { refetchOnMountOrArgChange: true }
  )

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

  useEffect(() => {
    if (labels) {
      setSelectedLabels(labels.map((v) => (v.id as unknown) as string))
    } else {
      setSelectedLabels([])
    }
  }, [labels])

  const hospitalsData = useMemo(() => {
    if (data) {
      return Array.isArray(data) ? data : [{ ...data }]
    } else {
      return undefined
    }
  }, [data])

  const totalInfo = useMemo(() => {
    const total: {
      [x: string]: number
    } = {}
    dailyStatValues.forEach(({ key }) => (total[key] = 0))
    if (hospitalsData && isSuccess) {
      dailyStatValues.map(({ key }) => {
        const dV = hospitalsData.reduce(
          (acc, curr) => acc + curr.totalDailyStat[key],
          0
        )
        total[key] = dV
      })

      console.log('TOTAL DATA', total)
    }
    return total
  }, [dailyStatValues, hospitalsData, isSuccess])

  const handleRoomSelect = (roomId: number | Array<number>) => {
    const tmpDate = parseISO(d.date)

    const sDate = startOfDay(addDays(tmpDate, -14))
    const eDate = endOfDay(addDays(tmpDate, 14))
    dispatch(
      filterByRoom({
        startDate: format(sDate, 'yyyy-MM-dd HH:mm'),
        endDate: format(eDate, 'yyyy-MM-dd HH:mm'),
        roomIdList: roomId,
      })
    )
    navigate.push('/booking')
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.rooms_label')}
          </Typography>
        </Grid>

        <Toolbar sx={{ sm: 6, py: 1, my: 1, width: '100%' }} component={Paper}>
          <Grid container spacing={2}>
            <Grid item lg={3} xs={12} md={6} sm={12}>
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
            <Grid item lg={3} xs={12} md={6} sm={12}>
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
            <Grid item lg={3} xs={12} md={6} sm={12}>
              <FormControl sx={{ m: 1, minWidth: 140 }} fullWidth>
                <InputLabel>{t('Labels')}</InputLabel>
                <Select
                  label={t('Labels')}
                  value={selectedLabels}
                  onChange={handleLabeltSelect}
                  multiple
                  input={<OutlinedInput label={t('Labels')} />}
                  renderValue={(selected) =>
                    labels
                      ?.filter((label) =>
                        selected.includes((label.id as unknown) as string)
                      )
                      .map((v) => v.name)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                >
                  {labels?.map((label) => (
                    <MenuItem key={label.id} value={label.id}>
                      <Checkbox
                        checked={
                          selectedLabels.indexOf(
                            (label.id as unknown) as string
                          ) > -1
                        }
                      />
                      <ListItemText
                        primary={label.name}
                        primaryTypographyProps={{ color: label.color }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item lg={3} xs={12} md={6} sm={12}>
              <FormControl sx={{ m: 1, minWidth: 140 }} fullWidth>
                <InputLabel>{t('Period')}</InputLabel>
                <Select
                  label={t('Period')}
                  value={period}
                  input={<OutlinedInput label={t('Period')} />}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value={'12'}>12</MenuItem>
                  <MenuItem value={'24'}>24</MenuItem>
                  <MenuItem value={'48'}>48</MenuItem>
                  <MenuItem value={'72'}>72</MenuItem>
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
                  <TableCell>{t('Label')}</TableCell>
                  {dailyStatValuesFn().map(({ key, label }) => (
                    <TableCell key={key}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDepartments.length > 0 &&
                  selectedLabels.length > 0 &&
                  hospitalsData &&
                  hospitalsData.map((row, idx) => (
                    <TableRow
                      key={idx}
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
                      <TableCell sx={{ color: row.label.color }}>
                        {row.label.name}
                      </TableCell>
                      {dailyStatValues.map(({ key }) => (
                        <Fragment key={key}>
                          {key !== 'placesFree' ? (
                            <TableCell key={key}>
                              {row.totalDailyStat[key]}
                            </TableCell>
                          ) : (
                            <FreePlaceInfo
                              key={key}
                              count={row.totalDailyStat[key]}
                              freeRooms={row.freeRooms}
                              onRoomSelect={handleRoomSelect}
                            />
                          )}
                        </Fragment>
                      ))}
                    </TableRow>
                  ))}
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    colSpan={3}
                    sx={{ fontWeight: 700, textAlign: 'right' }}
                  >
                    {t('Total')}
                  </TableCell>
                  {dailyStatValues.map(({ key }) => (
                    <TableCell key={key}>{totalInfo[key]}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  )
}
