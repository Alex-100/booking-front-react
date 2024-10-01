import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
  Paper,
  Pagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useSearchQuery } from 'modules/Booking/state/bookingService'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useGetAllHospitalsQuery,
  useGetDepartmentsByHospitalQuery,
} from 'services'
// import 'date-fns/locale/ru'
// import 'date-fns/locale/en-US'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import parseISO from 'date-fns/parseISO'
import { Print } from '@mui/icons-material'
// import { useAppSelector } from 'store'

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// }

interface PlaceBookingInfo {
  fio: string
  birthDate: string
  enteringDate: string
  leavingDate: string
  place: number
  placeLabel: string
  color?: string
  hospital: string
  department: string
}

export const StatisticRoomsStatusPage = () => {
  const { t, i18n } = useTranslation()

  const [selectedHospital, setSelectedHospital] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()))

  const { data: hospitals } = useGetAllHospitalsQuery(null)
  const handleHospitalSelect = (event: SelectChangeEvent) => {
    setSelectedHospital(event.target.value)
  }
  const handleDepartmentSelect = (
    event: SelectChangeEvent<typeof selectedDepartment>
  ) => {
    const {
      target: { value },
    } = event
    setSelectedDepartment(value)
  }

  //   const { data: departments } = useGetAllDepartmentsQuery({ page: 0 })
  const { data: hospitalDepartments } = useGetDepartmentsByHospitalQuery(
    {
      hospitalId: (selectedHospital as unknown) as number,
    },
    {
      skip: selectedHospital === '',
    }
  )

  // const availableHospitalDepartments = useMemo(
  //   () =>
  //     hospitalDepartments !== undefined
  //       ? hospitalDepartments.map((dep) => (dep.id as unknown) as string)
  //       : [],
  //   [hospitalDepartments]
  // )

  useEffect(() => {
    setSelectedDepartment('')
  }, [selectedHospital])

  const [page, setPage] = useState(1)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const { data } = useSearchQuery({
    pageNumber: page - 1,
    from: format(startOfDay(selectedDate.toDate()), 'yyyy-MM-dd HH:mm'),
    to: format(endOfDay(selectedDate.toDate()), 'yyyy-MM-dd HH:mm'),
    ...(selectedHospital !== '' && { hospitalId: +selectedHospital }),
    ...(selectedDepartment !== '' && { departmentId: +selectedDepartment }),
    sortBy: 'department',
    sortDirection: 'ASC',
  })

  useEffect(() => {
    console.log(
      'DATE',
      selectedDate.toDate(),
      startOfDay(selectedDate.toDate()),
      endOfDay(selectedDate.toDate()),
      format(startOfDay(selectedDate.toDate()), 'yyyy-MM-dd HH:mm'),
      format(endOfDay(selectedDate.toDate()), 'yyyy-MM-dd HH:mm')
    )
  }, [selectedDate])

  useEffect(() => {
    console.log('selectedHospital', selectedHospital)
  }, [selectedHospital])

  const unpacketPlaces = useMemo(() => {
    if (data) {
      const placeInfo: Array<PlaceBookingInfo> = []
      data.content.forEach((v) => {
        v.places.forEach((place) => {
          if (place.bookings.length > 0) {
            const tmpBooking = place.bookings.map((booking) => {
              const fio = `${booking.surname} ${booking.name} ${booking.surname}`
              const { dob, enteringDate, leavingDate } = booking
              return {
                fio,
                birthDate: dob,
                enteringDate,
                leavingDate,
                place: place.number,
                placeLabel: v.label.name,
                color: v.label.color,
                hospital: v.department.hospital.name,
                department: v.department.name,
              }
            })
            placeInfo.push(...tmpBooking)
          } else {
            const tmpBooking = {
              fio: '',
              birthDate: '',
              enteringDate: '',
              leavingDate: '',
              place: place.number,
              placeLabel: v.label.name,
              color: v.label.color,
              hospital: v.department.hospital.name,
              department: v.department.name,
            }
            placeInfo.push(tmpBooking)

            // return tmpBooking
          }
        })
      })
      return placeInfo
    } else {
      return []
    }
  }, [data])

  const handleDateSelect = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handlePrint = () => {
    const printWnd = window.open('', '_blank')
    const th = `
      <tr>
        <th>${t('Hospital')}</th>
        <th>${t('Department')}</th>
        <th>${t('Room')}</th>
        <th>${t('Label')}</th>
        <th>${t('FIO')}</th>
        <th>${t('Birth Date')}</th>
        <th>${t('Entering date')}</th>
        <th>${t('Leaving date')}</th>
      </tr>
    `
    const style = `<style type="text/css">
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
    </style>`

    const rows = unpacketPlaces.map(
      (v) => `<tr>
      <td>${v.hospital}</td>
      <td>${v.department}</td>
      <td>${v.place}</td>
      <td>${v.placeLabel}</td>
      <td>${v.fio}</td>
      <td>${
        v.birthDate !== ''
          ? format(
              parseISO(v.birthDate),
              i18n.language === 'ru' ? 'dd.MM.yyyy' : 'yyyy-MM-dd'
            )
          : ''
      }</td>
      <td>${
        v.enteringDate !== ''
          ? format(
              parseISO(v.enteringDate),
              i18n.language === 'ru' ? 'dd.MM.yyyy' : 'yyyy-MM-dd'
            )
          : ''
      }</td>
      <td>
      ${
        v.leavingDate !== ''
          ? format(
              parseISO(v.leavingDate),
              i18n.language === 'ru' ? 'dd.MM.yyyy' : 'yyyy-MM-dd'
            )
          : ''
      }</td>
    </tr>`
    )
    printWnd?.document.write(
      `<html>
        <head>${style}</head>
        <body>
          <table style="width: 100%">
            ${th}
            <tbody>
              ${rows.join('')}
            </tbody>
          </table>
        </body>
      ,</html>`
    )

    /**
     * 
     *  {unpacketPlaces.map((v, idx) => (
                <TableRow key={idx}>
                  <TableCell>{v.hospital}</TableCell>
                  <TableCell>{v.department}</TableCell>
                  <TableCell>{v.place}</TableCell>
                  <TableCell>
                    <Typography color={v.color}>{v.placeLabel}</Typography>
                  </TableCell>
                  <TableCell>{v.fio}</TableCell>
                  <TableCell>
                    {v.birthDate !== '' && (
                      <Typography>
                        {format(
                          parseISO(v.birthDate),
                          i18n.language === 'ru' ? 'dd.MM.yyyy' : 'yyyy-MM-dd'
                        )}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {v.enteringDate !== '' && (
                      <Typography>
                        {format(
                          parseISO(v.enteringDate),
                          i18n.language === 'ru'
                            ? 'dd.MM.yyyy HH:mm'
                            : 'yyyy-MM-dd HH:mm'
                        )}
                      </Typography>
                    )}

                    
                    </TableCell>
                    <TableCell>
                      {v.leavingDate !== '' && (
                        <Typography>
                          {format(
                            parseISO(v.leavingDate),
                            i18n.language === 'ru'
                              ? 'dd.MM.yyyy HH:mm'
                              : 'yyyy-MM-dd HH:mm'
                          )}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
     */
    printWnd?.print()
    // printWnd?.close()
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5">
          {t('Statistic')}. {t('statistic.rooms_status')}
        </Typography>

        <Toolbar sx={{ sm: 6, py: 1, my: 1, width: '100%' }} component={Paper}>
          <Grid container spacing={2}>
            <Grid item lg={2} md={2} xs={12} sm={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={i18n.language}
                >
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateSelect}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item lg={4} xs={12} md={4} sm={12}>
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
            <Grid item lg={4} xs={12} md={4} sm={12}>
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
                  value={selectedDepartment}
                  onChange={handleDepartmentSelect}
                >
                  <MenuItem value={''}>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {hospitalDepartments?.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2} md={2} xs={12} sm={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ height: '56px' }}
                  onClick={handlePrint}
                >
                  <Print />
                  {t('Print')}
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Toolbar>

        <Toolbar sx={{ sm: 6, py: 1, my: 1, width: '100%' }} component={Paper}>
          {/* <Grid container spacing={2}></Grid> */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Hospital')}</TableCell>
                <TableCell>{t('Department')}</TableCell>
                <TableCell>{t('Room')}</TableCell>
                <TableCell>{t('Label')}</TableCell>
                <TableCell>{t('FIO')}</TableCell>
                <TableCell>{t('Birth Date')}</TableCell>
                <TableCell>{t('Entering date')}</TableCell>
                <TableCell>{t('Leaving date')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unpacketPlaces.map((v, idx) => (
                <TableRow key={idx}>
                  <TableCell>{v.hospital}</TableCell>
                  <TableCell>{v.department}</TableCell>
                  <TableCell>{v.place}</TableCell>
                  <TableCell>
                    <Typography color={v.color}>{v.placeLabel}</Typography>
                  </TableCell>
                  <TableCell>{v.fio}</TableCell>
                  <TableCell>
                    {v.birthDate !== '' && (
                      <Typography>
                        {format(
                          parseISO(v.birthDate),
                          i18n.language === 'ru' ? 'dd.MM.yyyy' : 'yyyy-MM-dd'
                        )}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {v.enteringDate !== '' && (
                      <Typography>
                        {format(
                          parseISO(v.enteringDate),
                          i18n.language === 'ru'
                            ? 'dd.MM.yyyy HH:mm'
                            : 'yyyy-MM-dd HH:mm'
                        )}
                      </Typography>
                    )}

                    {/* {v.enteringDate} */}
                  </TableCell>
                  <TableCell>
                    {v.leavingDate !== '' && (
                      <Typography>
                        {format(
                          parseISO(v.leavingDate),
                          i18n.language === 'ru'
                            ? 'dd.MM.yyyy HH:mm'
                            : 'yyyy-MM-dd HH:mm'
                        )}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Toolbar>

        {data && (
          <Pagination
            count={data.totalPages}
            onChange={handleChangePage}
            page={page}
          />
        )}
      </Grid>
    </Grid>
  )
}
