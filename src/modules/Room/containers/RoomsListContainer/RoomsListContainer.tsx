import React from 'react'
import {
  useGetAllRoomsQuery,
  useRemoveRoomMutation,
  useRemoveRoomsArrayMutation,
} from '../../services/roomService'
import { alpha } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import EntityOptionsMenu from '../../../../components/layouts/EntityOptionsMenu'
import { useAuth, useEntityModal } from '../../../../hooks'
import { RoomModel } from '../../types'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import EntityRemoveModal from '../../../../components/layouts/EntityRemoveModal'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import { useGetAllLabelsQuery } from '../../../Label/label'
import { useGetAllDepartmentsQuery } from '../../../Department/department'
import { useGetAllHospitalsQuery } from '../../../Hospital/hospital'
import RoomsTableFooter from './components/RoomsTableFooter'
import RoomsTableHeader from './components/RoomsTableHeader'
import Divider from '@mui/material/Divider'
import { useTranslation } from 'react-i18next'
import { CircularProgress } from '@mui/material'
import { useGetUserByUsernameQuery } from 'services'
import { useAppDispatch, useAppSelector } from 'store'
import {
  setRoomPage,
  setRoomPageFilters,
  setRoomPageSize,
} from 'modules/Room/model/roomPageModel'

const RoomsListContainer: React.FC = () => {
  const { t } = useTranslation()
  const matchesLg = useMediaQuery((theme: any) => theme.breakpoints.up('lg'))
  const matchesMd = useMediaQuery((theme: any) => theme.breakpoints.up('md'))
  const matchesSm = useMediaQuery((theme: any) => theme.breakpoints.up('sm'))

  const auth = useAuth()
  const modals = useEntityModal<RoomModel>()

  const labelsQuery = useGetAllLabelsQuery(null)
  const departmentsQuery = useGetAllDepartmentsQuery({ page: 0 })
  const hospitalsQuery = useGetAllHospitalsQuery(null)

  const dispatch = useAppDispatch()

  const { page, pageSize, filters } = useAppSelector(
    (store) => store.roomPageData
  )

  // const [filters, setFilters] = React.useState({
  //   hospitalId: undefined,
  //   labelId: undefined,
  //   departmentId: undefined,
  // })

  const handleSetFilter = (filter: 'hospital' | 'label' | 'department') => (
    event: SelectChangeEvent
  ) => {
    dispatch(
      setRoomPageFilters({ ...filters, [`${filter}Id`]: event.target.value })
    )
  }

  const handleChangePage = (p: number) => {
    dispatch(setRoomPage(p))
  }

  const handleChangePageSize = (p: number) => {
    dispatch(setRoomPageSize(p))
  }
  // endregion pagination

  // region fetch
  const { data, status } = useGetAllRoomsQuery({
    pageNumber: page,
    pageSize,
    ...Object.fromEntries(Object.entries(filters).filter((v) => !!v[1])),
  })
  // endregion fetch

  // region select
  const [selected, setSelected] = React.useState<number[]>([])
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false)
  const handleToggleRemoveModal = () => {
    if (openRemoveModal) {
      setSelected([])
    }
    setOpenRemoveModal(!openRemoveModal)
  }

  const handleSelect = (id: number) => () => {
    if (selected.includes(id)) {
      setSelected(selected.filter((v) => v !== id))
      return
    }

    setSelected([...selected, id])
  }

  const handleSelectAll = (checked: boolean) => {
    if (!data) return

    if (checked) {
      setSelected(data.content.map((v) => v.id))
      return
    }

    setSelected([])
  }
  // endregion select

  const { data: user } = useGetUserByUsernameQuery(auth.user.username)
  const canEdit = React.useMemo(
    () =>
      user &&
      user.roles &&
      user.roles.filter((role) =>
        ['admin', 'booking_and_room_edit'].includes(role.name)
      ).length > 0
        ? true
        : false,
    [user]
  )

  if (!data)
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )

  return (
    <Stack spacing={3}>
      <TableContainer component={Paper}>
        {/* region toolbarView */}
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme: any) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} {t('selected')}
            </Typography>
          ) : (
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
              {t('Rooms')}
              <Typography variant="caption" sx={{ ml: 1.5 }}>
                {data.totalElements}
              </Typography>
            </Typography>
          )}
          {selected.length > 0 && canEdit && (
            <Tooltip title={t('Remove rooms')}>
              <IconButton onClick={handleToggleRemoveModal}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        {/* endregion toolbarView */}
        {/* region filtersView */}
        <Toolbar sx={{ pl: { sm: 2 } }}>
          <Stack
            direction={matchesSm ? 'row' : 'column'}
            spacing={2}
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <FormControl size="small" sx={{ width: matchesSm ? 160 : '100%' }}>
              <InputLabel id="rooms-list-container-filter-label">
                {t('Label')}
              </InputLabel>
              <Select
                labelId="rooms-list-container-filter-label"
                id="rooms-list-container-filter-label"
                value={filters.labelId}
                label={t('Label')}
                size="small"
                onChange={handleSetFilter('label')}
              >
                <MenuItem value="">
                  <em>{t('None')}</em>
                </MenuItem>
                {labelsQuery.data &&
                  labelsQuery.data.map((label) => (
                    <MenuItem
                      key={label.id}
                      value={label.id}
                      sx={{ color: label.color }}
                    >
                      {label.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: matchesSm ? 160 : '100%' }}>
              <InputLabel id="rooms-list-container-filter-department">
                {t('Department')}
              </InputLabel>
              <Select
                labelId="rooms-list-container-filter-department"
                id="rooms-list-container-filter-department"
                value={filters.departmentId}
                label={t('Department')}
                onChange={handleSetFilter('department')}
              >
                <MenuItem value="">
                  <em>{t('None')}</em>
                </MenuItem>
                {departmentsQuery.data &&
                  departmentsQuery.data.content.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: matchesSm ? 160 : '100%' }}>
              <InputLabel id="rooms-list-container-filter-hospital">
                {t('Hospital')}
              </InputLabel>
              <Select
                labelId="rooms-list-container-filter-hospital"
                id="rooms-list-container-filter-hospital"
                value={filters.hospitalId}
                label={t('Hospital')}
                onChange={handleSetFilter('hospital')}
              >
                <MenuItem value="">
                  <em>{t('None')}</em>
                </MenuItem>
                {hospitalsQuery.data &&
                  hospitalsQuery.data.map((hospital) => (
                    <MenuItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Stack>
        </Toolbar>
        {/* endregion filtersView */}

        <Table>
          <RoomsTableHeader
            rooms={data}
            selected={selected}
            onSelectAll={handleSelectAll}
          />
          {/* region tableBodyView */}
          <TableBody>
            {status === 'pending' && (
              <Box
                sx={{ display: 'table-row', height: '240px' }}
                component={'tr'}
              >
                <Box
                  sx={{ display: 'table-cell', textAlign: 'center' }}
                  component={'td'}
                  colSpan={6}
                >
                  <CircularProgress />
                  <div>{t('wait_data')}</div>
                </Box>
              </Box>
            )}

            {status === 'fulfilled' &&
              data &&
              data.content.map((row: RoomModel) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  hover
                  onClick={handleSelect(row.id)}
                  role="checkbox"
                  selected={selected.includes(row.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selected.includes(row.id)}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" width={70}>
                    {row.id}
                  </TableCell>
                  {!matchesMd && (
                    <TableCell component="th" scope="row">
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">
                          {row.roomNumber}
                        </Typography>
                        <Typography variant="caption">
                          <Typography variant="caption" color="text.secondary">
                            {t('Capacity')}:{' '}
                          </Typography>
                          {row.capacity}
                        </Typography>
                        <Typography variant="caption">
                          <Typography variant="caption" color="text.secondary">
                            {t('Department')}:{' '}
                          </Typography>
                          {row.department.name}
                        </Typography>
                        <Typography variant="caption">
                          <Typography variant="caption" color="text.secondary">
                            {t('Label')}:{' '}
                          </Typography>
                          <Typography color={row.label.color} variant="caption">
                            {row.label.name}
                          </Typography>
                        </Typography>
                      </Stack>
                    </TableCell>
                  )}
                  {matchesMd && (
                    <>
                      <TableCell component="th" scope="row">
                        {row.roomNumber}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.capacity}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography color={row.label.color}>
                          {row.label.name}
                        </Typography>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.department.name}
                      </TableCell>
                    </>
                  )}
                  {matchesLg && (
                    <TableCell component="th" scope="row">
                      <Stack direction="row" spacing={0.75} component="span">
                        {row.places
                          .filter((_, index) => index <= 7)
                          .map((p) => (
                            <Chip key={p.id} label={p.number} />
                          ))}
                        {row.places.length > 8 && (
                          <Chip
                            label={`+${row.places.length - 8}`}
                            color="primary"
                          />
                        )}
                      </Stack>
                    </TableCell>
                  )}
                  <TableCell component="th" scope="row" width={60}>
                    <EntityOptionsMenu
                      canRemove={canEdit}
                      onRemove={modals.onRemove(row)}
                      to={`/rooms/${row.id}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {/* endregion tableBodyView */}
        </Table>
        <Divider />
        <RoomsTableFooter
          objects={data}
          onChangePageNumber={handleChangePage}
          pageNumber={page}
          pageSize={pageSize}
          onChangePageSize={handleChangePageSize}
        />
      </TableContainer>
      <EntityRemoveModal
        {...modals.remove}
        title={t('Do you want to delete a room?')}
        mutation={useRemoveRoomMutation}
      />
      <EntityRemoveModal
        open={openRemoveModal}
        onClose={handleToggleRemoveModal}
        entityData={selected}
        title={t('Do you want to delete a rooms?')}
        mutation={useRemoveRoomsArrayMutation}
      />
    </Stack>
  )
}

export default RoomsListContainer
