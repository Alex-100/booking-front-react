import React, { useMemo } from 'react'
import {
  useAddRoomPlaceMutation,
  useGetRoomQuery,
  useRemoveRoomMutation,
  useRemoveRoomPlaceMutation,
  useUpdateRoomMutation,
} from '../services/roomService'
import Stack from '@mui/material/Stack'
// import { useAuth, useEntityModal } from '../../../hooks'
import { PlaceModel, RoomModel } from '../types'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import EntityOptionsMenu from '../../../components/layouts/EntityOptionsMenu'
import EntityFormModal from '../../../components/layouts/EntityFormModal'
import RoomForm from '../forms/RoomForm'
import EntityRemoveModal from '../../../components/layouts/EntityRemoveModal'
import { useAuth, useEntityModal } from '../../../hooks'
import { useTranslation } from 'react-i18next'

interface RoomDetailContainerProps {
  id: RoomModel['id']
}

const RoomDetailContainer: React.FC<RoomDetailContainerProps> = ({ id }) => {
  const auth = useAuth()
  const modals = useEntityModal<RoomModel>()
  const { data, isLoading } = useGetRoomQuery({ id })
  const [removePlace] = useRemoveRoomPlaceMutation()
  const [addPlace] = useAddRoomPlaceMutation()

  const { t } = useTranslation()
  const handleDeletePlace = (placeId: PlaceModel['id']) => () => {
    removePlace({ placeId, roomId: id })
  }

  const placesCount = useMemo(
    () => (data && data.places && data.places.length ? data.places.length : 0),
    [data]
  )
  const handleAddPlace = () => {
    if (placesCount < 99) addPlace({ id })
  }

  if (!data || isLoading)
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )

  const room: RoomModel = data

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Link to="/rooms">
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h5">
              {t('Room #')}
              {room.roomNumber}
            </Typography>
          </Stack>
          <EntityOptionsMenu
            canEdit={auth.check('admin', 'booking_and_room_edit')}
            canRemove={auth.check('admin', 'booking_and_room_edit')}
            onEdit={modals.onEdit(room)}
            onRemove={modals.onRemove(room)}
          />
          <EntityFormModal
            {...modals.edit}
            form={RoomForm}
            mutation={useUpdateRoomMutation}
            title={t('Update room')}
          />
          <EntityRemoveModal
            {...modals.remove}
            title={t('Do you want to delete a room?')}
            mutation={useRemoveRoomMutation}
          />
        </Stack>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={{ width: 120 }} component="th" scope="row">
                  <Typography variant="subtitle2">{t('Capacity')}:</Typography>
                </TableCell>
                <TableCell align="left">{room.capacity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle2">{t('Label')}:</Typography>
                </TableCell>
                <TableCell align="left">
                  <Paper sx={{ p: 1.5 }} variant="outlined">
                    <Stack spacing={1}>
                      <Typography
                        variant="subtitle2"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color={room.label.color}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: room.label.color,
                            borderRadius: 6,
                            mr: 0.75,
                          }}
                        />
                        {room.label.name}
                      </Typography>
                      <Typography variant="caption">
                        <Typography variant="caption" color="text.secondary">
                          {t('Description')}:{' '}
                        </Typography>
                        {room.label.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle2">
                    {t('Department')}:
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Paper sx={{ p: 1.5 }} variant="outlined">
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">
                        {room.department.name}
                      </Typography>
                      <Typography variant="caption">
                        <Typography variant="caption" color="text.secondary">
                          {t('Description')}:{' '}
                        </Typography>
                        {room.department.description}
                      </Typography>
                      <Typography variant="caption">
                        <Typography variant="caption" color="text.secondary">
                          {t('Hospital')}:{' '}
                        </Typography>
                        {room.department.hospital.name}
                      </Typography>
                    </Stack>
                  </Paper>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle2">{t('Places')}:</Typography>
                </TableCell>
                <TableCell align="left">
                  <Stack direction="row" spacing={0.75} component="span">
                    {room.places
                      .filter((_, index) => index <= 7)
                      .map((p) => (
                        <Chip
                          key={p.id}
                          label={p.number}
                          onDelete={handleDeletePlace(p.id)}
                        />
                      ))}
                    {placesCount > 8 && (
                      <Chip label={`+${placesCount - 8}`} color="primary" />
                    )}
                    <Chip
                      disabled={
                        !(data && data.places && data.places.length < 99)
                      }
                      icon={<AddIcon />}
                      label={t('Add place')}
                      color="primary"
                      variant="outlined"
                      onClick={handleAddPlace}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  )
}

export default RoomDetailContainer
