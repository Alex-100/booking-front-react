import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useGetAllLabelsQuery } from '../../../../../Label/label'
import { useGetAllDepartmentsQuery } from '../../../../../Department/department'
import { useGetAllHospitalsQuery } from '../../../../../Hospital/hospital'
import { useGetAllRoomsQuery } from '../../../../../Room/services/roomService'
import Pagination from '@mui/material/Pagination'
import { ListItemIcon, useMediaQuery } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import { RoomModel } from '../../../../../Room/types'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import FormHelperText from '@mui/material/FormHelperText'
import { useTranslation } from 'react-i18next'
import { SelectedPlaceInfo } from 'types/SelectedPlaceInfo'

interface RoomAccordionProps {
  room: RoomModel
  checked: number[]
  onCheck(v: number): void
  isFirst?: boolean
  isGroup?: boolean
  selectPlace: (info: SelectedPlaceInfo) => void
  // selectPlaceGroup: (places: Array<SelectedPlaceInfo>) => void
  selectPlacesInRoom: (roomId: number) => void
  selected: Array<SelectedPlaceInfo>
}

const RoomAccordion: React.FC<RoomAccordionProps> = (props) => {
  const {
    room,
    // checked,
    // onCheck,
    isFirst,
    isGroup,
    selectPlace,
    // selectPlaceGroup,
    selectPlacesInRoom,
    selected,
  } = props
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  const handleToggle = (id: number) => () => {
    const { department, places, id: roomId, roomNumber } = props.room
    const place = places.find((item) => item.id === id)
    // console.log(props.room)
    const selectedPlace: SelectedPlaceInfo = {
      id,
      number: place?.number || 0,
      departmentId: department.id,
      departmentName: department.name,
      hospitalId: department.hospital.id,
      hospitalName: department.hospital.name,
      roomId,
      roomNumber,
    }
    // onCheck(id)
    selectPlace(selectedPlace)
  }

  // const placesIds = useMemo(() => room.places.map((p) => p.id), [room])
  // const placesInRoom = useMemo(
  //   () => selected.filter((item) => item.roomId === room.id),
  //   [selected, room]
  // )
  const placesIds = room.places.map((p) => p.id)
  const placesInRoom = selected.filter((item) => item.roomId === room.id)

  // const includePlaces = placesIds.filter((p) => checked.includes(p))

  const handleGroupClick = (
    // e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) =>
    // e: React.ChangeEvent<HTMLInputElement>

    {
      e.preventDefault()

      // const places = room.places.map((place) => {
      //   const selectedPlace: SelectedPlaceInfo = {
      //     id: place.id,
      //     number: place.number,
      //     departmentId: room.department.id,
      //     departmentName: room.department.name,
      //     hospitalId: room.department.hospital.id,
      //     hospitalName: room.department.hospital.name,
      //     roomId: room.id,
      //     roomNumber: room.roomNumber,
      //   }
      //   return selectedPlace
      //   // selectPlace(selectedPlace)
      // })
      // selectPlaceGroup(places)
      selectPlacesInRoom(room.id)
      e.stopPropagation()
    }

  return (
    <>
      {!isFirst && <Divider />}
      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  bgcolor: room.label.color,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  border: '1px solid rgb(0 0 0 / 20%)',
                }}
              />
              {isGroup && (
                <>
                  <div>
                    <ListItemIcon onClick={handleGroupClick}>
                      <Checkbox
                        // onClick={(e) => {
                        //   e.preventDefault()
                        // }}
                        // onChange={handleGroupClick}
                        indeterminate={
                          placesInRoom.length > 0 &&
                          placesInRoom.length !== placesIds.length
                        }
                        checked={placesInRoom.length === placesIds.length}
                        disableRipple
                      />
                    </ListItemIcon>
                  </div>
                  {/* <ListItemButton
                    onClick={handleGroupClick}
                    sx={{ pl: 4, maxWidth: '142px', height: '42px' }}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        // onClick={(e) => {
                        //   e.preventDefault()
                        // }}
                        // onChange={handleGroupClick}
                        indeterminate={
                          placesInRoom.length > 0 &&
                          placesInRoom.length !== placesIds.length
                        }
                        checked={placesInRoom.length === placesIds.length}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={''} />
                  </ListItemButton> */}
                </>
              )}
              <Typography variant="subtitle2">{room.roomNumber}</Typography>
              {isGroup && (
                <Typography variant="caption">{`${placesInRoom.length}/${placesIds.length}`}</Typography>
              )}
            </Stack>
          }
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {room.places.map((place) => (
            <ListItem key={place.id} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(place.id)}
                dense
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  {!isGroup ? (
                    <Radio
                      edge="start"
                      checked={
                        selected.find((item) => item.id === place.id) !==
                        undefined
                      }
                      tabIndex={-1}
                      disableRipple
                    />
                  ) : (
                    <Checkbox
                      edge="start"
                      checked={
                        selected.find((item) => item.id === place.id) !==
                        undefined
                      }
                      tabIndex={-1}
                      disableRipple
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={`${place.number}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  )
}

const PlaceSelector: React.FC<any> = (props) => {
  const {
    input,
    meta: { touched, invalid, error },
    isGroup,
    placeInfo,
  } = props

  const { t } = useTranslation()

  const departmentsQuery = useGetAllDepartmentsQuery({ page: 0 })
  const hospitalsQuery = useGetAllHospitalsQuery(null)
  const labelsQuery = useGetAllLabelsQuery(null)
  const [filters, setFilters] = React.useState({
    hospitalId: undefined,
    labelId: undefined,
    departmentId: undefined,
  })

  const handleSetFilter = (filter: 'hospital' | 'label' | 'department') => (
    event: SelectChangeEvent
  ) => {
    setFilters({ ...filters, [`${filter}Id`]: event.target.value })
  }

  const matchSm = useMediaQuery((theme: any) => theme.breakpoints.up('md'))

  const [pageNumber, setPage] = React.useState(1)
  const handleChangePage = (_event: any, p: number) => {
    setPage(p)
  }

  const { data } = useGetAllRoomsQuery({
    pageNumber: pageNumber - 1,
    ...Object.fromEntries(Object.entries(filters).filter((v) => !!v[1])),
  })

  const [checked, setChecked] = React.useState([0])
  const [selectedPlaces, setSelectedPlaces] = useState<
    Array<SelectedPlaceInfo>
  >([])

  const [appliedSelectedPlaces, setAppliedSelectedPlaces] = useState<
    Array<SelectedPlaceInfo>
  >([])

  useEffect(() => {
    if (placeInfo) {
      setSelectedPlaces([placeInfo])
      setAppliedSelectedPlaces([placeInfo])
      input.onChange(placeInfo.id)
    }
  }, [placeInfo])

  const handleSelectAll = () => {
    if (data) {
      const tmpSelected: Array<SelectedPlaceInfo> = data.content
        .map((room) => {
          const { department, places } = room
          const roomInfo = {
            departmentId: department.id,
            departmentName: department.name,
            hospitalId: department.hospital.id,
            hospitalName: department.hospital.name,
            places,
          }
          return roomInfo.places.map((place) => ({
            id: place.id,
            number: place.number,
            departmentId: roomInfo.departmentId,
            departmentName: roomInfo.departmentName,
            hospitalId: roomInfo.hospitalId,
            hospitalName: roomInfo.hospitalName,
            roomId: room.id,
            roomNumber: room.roomNumber,
          }))
        })
        .flat()

      setSelectedPlaces(tmpSelected)
    }
  }

  const handleToggle = (v: number) => {
    const currentIndex = checked.indexOf(v)
    const newChecked = isGroup ? [...checked] : [0]

    if (currentIndex === -1) {
      newChecked.push(v)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  useEffect(() => {
    console.log('Places', selectedPlaces)
  }, [selectedPlaces])

  const handleSelect = (place: SelectedPlaceInfo) => {
    if (isGroup) {
      setSelectedPlaces((prev) =>
        prev.find((item) => item.id === place.id) !== undefined
          ? prev.filter((item) => item.id !== place.id)
          : [...prev, place]
      )
    } else {
      setSelectedPlaces((prev) =>
        prev.find((item) => item.id === place.id) ? [] : [place]
      )
    }
  }

  const getPlacesInRoom = (room: RoomModel): SelectedPlaceInfo[] => {
    const { department, places } = room
    const roomInfo = {
      departmentId: department.id,
      departmentName: department.name,
      hospitalId: department.hospital.id,
      hospitalName: department.hospital.name,
      places,
    }
    return roomInfo.places.map((place) => ({
      id: place.id,
      number: place.number,
      departmentId: roomInfo.departmentId,
      departmentName: roomInfo.departmentName,
      hospitalId: roomInfo.hospitalId,
      hospitalName: roomInfo.hospitalName,
      roomId: room.id,
      roomNumber: room.roomNumber,
    }))
  }

  const handleSelectRoom = (roomId: number) => {
    if (data) {
      // console.log('Try add room place', roomId)
      const selectedRoom = data.content.find((room) => room.id === roomId)

      const placesInRoom: SelectedPlaceInfo[] = selectedRoom
        ? getPlacesInRoom(selectedRoom)
        : []

      setSelectedPlaces((prev) =>
        prev.findIndex((item) => item.roomId === roomId) >= 0
          ? prev.filter((item) => item.roomId !== roomId)
          : [...prev, ...placesInRoom]
      )
      //   const tmp: Array<SelectedPlaceInfo> = selectedPlaces

      //   const existRoom = tmp.findIndex((item) => item.roomId === roomId)
      //   if (existRoom >= 0) {
      //     const removed = tmp.filter((item) => item.roomId !== roomId)
      //     console.log('Try remove ')
      //     setSelectedPlaces(removed)
      //   } else if (selectedRoom) {
      //     const { department, places } = selectedRoom
      //     const roomInfo = {
      //       departmentId: department.id,
      //       departmentName: department.name,
      //       hospitalId: department.hospital.id,
      //       hospitalName: department.hospital.name,
      //       places,
      //     }
      //     const placesInRoom = roomInfo.places.map((place) => ({
      //       id: place.id,
      //       number: place.number,
      //       departmentId: roomInfo.departmentId,
      //       departmentName: roomInfo.departmentName,
      //       hospitalId: roomInfo.hospitalId,
      //       hospitalName: roomInfo.hospitalName,
      //       roomId: selectedRoom.id,
      //       roomNumber: selectedRoom.roomNumber,
      //     }))

      //     ////

      //     tmp.push(...placesInRoom)
      //     setSelectedPlaces(tmp)
      //   }
    }
  }

  /*   const handleSelectPlaceGroup = (places: Array<SelectedPlaceInfo>) => {
    // const addingPlacesCount = places.length
    const addingPlaceGroupIds = places.map((place) => place.id)
    const tmp: Array<SelectedPlaceInfo> = selectedPlaces
    // const findedPlaces: Array<SelectedPlaceInfo> = []
    // for(let i=0; i< addingPlacesCount; i++){
    //   const  findedPlace = selectedPlaces.find((place)=>place.id===places[i].id)
    //   if (findedPlace){
    //     findedPlaces.push(findedPlace)
    //   }

    // }
    const diff = selectedPlaces.filter((place) =>
      addingPlaceGroupIds.includes(place.id)
    )
    if (diff.length === 0) {
      //
      tmp = tmp.concat(places)
    } else {
      //
    }
    setSelectedPlaces(tmp)

    console.log(tmp, places, diff)
  } */

  const [open, setOpen] = React.useState(false)
  const handleToggleModal = () => {
    setOpen(!open)

    if (open) {
      input.onFocus(null as any)
    } else {
      input.onBlur(checked.slice(1))
    }
  }

  const handleContinue = () => {
    // if (!checked) return

    // input.onChange(checked.slice(1))
    setAppliedSelectedPlaces(selectedPlaces)
    const selected = selectedPlaces.map(({ id }) => id)
    console.debug('Selected places IDs', selected)
    input.onChange(selected)
    // const selected = sel
    handleToggleModal()
  }

  return (
    <>
      <Dialog
        onClose={handleToggleModal}
        maxWidth="lg"
        open={open}
        sx={{ overflow: 'visible' }}
      >
        <DialogTitle>{t('Select a place')}</DialogTitle>
        <DialogContent sx={{ overflow: 'visible' }}>
          <Stack spacing={3} sx={{ width: 350 }}>
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <FormControl size="small" sx={{ width: '100%' }}>
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
              <FormControl size="small" sx={{ width: '100%' }}>
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
              <FormControl size="small" sx={{ width: '100%' }}>
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
            <Stack spacing={1}>
              {isGroup && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography>
                    {selectedPlaces.length === 0
                      ? t('Nothing selected')
                      : `${t('Selected places')}: ${selectedPlaces.length}`}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ minWidth: 140 }}
                    onClick={handleSelectAll}
                  >
                    {t('Select ALL')}
                  </Button>
                </Box>
              )}
              <Paper variant="outlined">
                <List sx={{ width: '100%' }} disablePadding>
                  {data &&
                    data.content.map((room, i) => (
                      <RoomAccordion
                        key={room.id}
                        room={room}
                        onCheck={handleToggle}
                        checked={checked}
                        isFirst={i === 0}
                        isGroup={isGroup}
                        selected={selectedPlaces}
                        selectPlace={handleSelect}
                        // selectPlaceGroup={handleSelectPlaceGroup}
                        selectPlacesInRoom={handleSelectRoom}
                      />
                    ))}
                </List>
              </Paper>
            </Stack>
            {data && (
              <Pagination
                count={data.totalPages}
                onChange={handleChangePage}
                page={pageNumber}
              />
            )}
          </Stack>
          <Stack direction="row">
            <Button
              variant="outlined"
              onClick={handleContinue}
              disabled={!checked}
            >
              {t('Continue')}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          width: '100%',
          ...(touched &&
            invalid && { borderColor: (theme) => theme.palette.error.main }),
        }}
      >
        <Stack
          direction={!matchSm ? 'column' : 'row'}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            width: '100%',
          }}
        >
          <Typography>
            <Typography variant="subtitle2">{t('Place')}</Typography>
            <Typography>
              {appliedSelectedPlaces.length >= 5 ? (
                <>
                  {t('selectedPlaceCount', {
                    count: appliedSelectedPlaces.length,
                  })}
                </>
              ) : (
                <>
                  {appliedSelectedPlaces
                    .map(
                      (place) =>
                        `${place.number}/${place.roomNumber}/${place.departmentName}/${place.hospitalName}`
                    )
                    .join(', ')}
                </>
              )}
            </Typography>
          </Typography>
          <Button onClick={handleToggleModal} sx={{ minWidth: 140 }}>
            {t('Select place')}
          </Button>
        </Stack>
        <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>
          {touched && error}
        </FormHelperText>
      </Paper>
    </>
  )
}

export default PlaceSelector
