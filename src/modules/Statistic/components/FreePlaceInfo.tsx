import { Box, List, ListItemButton, Popover, TableCell } from '@mui/material'
import { useState } from 'react'

interface FreePlaceInfoProps {
  count: number
  freeRooms: Array<{ room: number; place: number }>
}

export const FreePlaceInfo = ({ freeRooms, count }: FreePlaceInfoProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLTableCellElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectRoom = () => {
    handleClose()
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
        >
          <List
            sx={{
              maxHeight: 200,
              minWidth: 280,
              maxWidth: 460,
              bgcolor: 'background.paper',
            }}
            component={'nav'}
          >
            {freeRooms.map((v) => (
              <ListItemButton onClick={handleSelectRoom}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    width: '100%',
                  }}
                >
                  <span>Кабинет {v.room}</span> <span>Место {v.place}</span>
                </Box>
              </ListItemButton>
            ))}
          </List>
        </Popover>
      )}
    </>
  )
}
