import { Box, List, ListItemButton, Popover, TableCell } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FreePlaceInfoProps {
  count: number
  freeRooms: Array<{ room: number; place: number; roomId: number }>
  onRoomSelect: (roomId: number) => void
}

export const FreePlaceInfo = ({
  freeRooms,
  count,
  onRoomSelect,
}: FreePlaceInfoProps) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<HTMLTableCellElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectRoom = (id: number) => {
    handleClose()
    onRoomSelect(id)
  }

  const open = Boolean(anchorEl)
  return (
    <>
      <TableCell
        onClick={handleClick}
        sx={{ ...(freeRooms.length > 0 && { cursor: 'pointer' }) }}
      >
        {count}
      </TableCell>
      {freeRooms.length > 0 && (
        <Popover
          // id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{ maxHeight: 500 }}
        >
          <List
            sx={{
              minWidth: 280,
              maxWidth: 460,
              bgcolor: 'background.paper',
            }}
            component={'nav'}
          >
            {freeRooms.map((v) => (
              <ListItemButton
                onClick={() => handleSelectRoom(v.roomId)}
                sx={{
                  paddingY: '1px',
                  paddingLeft: '8px',
                  paddingRight: '24px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    width: '100%',
                    ':hover': {
                      color: '#1976d2',
                    },
                  }}
                >
                  <span>
                    {t('Room')} {v.room}
                  </span>{' '}
                  <span>
                    {t('Place')} {v.place}
                  </span>
                </Box>
              </ListItemButton>
            ))}
          </List>
        </Popover>
      )}
    </>
  )
}
