import React from 'react'
import RoomsListContainer from '../containers/RoomsListContainer/RoomsListContainer'
import EntityPage from '../../../components/layouts/EntityPage'
import RoomForm from '../forms/RoomForm'
import {
  useCreateRoomGroupMutation,
  useCreateRoomMutation,
} from '../services/roomService'
import EntityFormModal from '../../../components/layouts/EntityFormModal'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import GroupRoomForm from '../forms/GroupRoomForm'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'hooks'
import { useGetUserByUsernameQuery } from 'services'

const RoomsListPage: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()

  const handleToggle = () => {
    setOpen(!open)
  }

  const auth = useAuth()
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

  return (
    <EntityPage
      title={t('Rooms')}
      container={<RoomsListContainer />}
      createBtnTitle={t('New room')}
      form={RoomForm}
      mutation={useCreateRoomMutation}
      header={
        <>
          {canEdit && (
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={handleToggle}
              sx={{ ml: 2 }}
            >
              {t('New group')}
            </Button>
          )}

          <EntityFormModal
            onClose={handleToggle}
            open={open}
            form={GroupRoomForm}
            mutation={useCreateRoomGroupMutation}
            title={t('New group room')}
          />
        </>
      }
    />
  )
}

export default RoomsListPage
