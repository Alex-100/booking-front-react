import React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FilterListIcon from '@mui/icons-material/FilterList'

import ScheduleContainer from './containers/ScheduleContainer/ScheduleContainer'
import FiltersFormContainer from './containers/Filters/FiltersFormContainer'
import FiltersViewContainer from './containers/Filters/FiltersViewContainer'
import DateRangeContainer from './containers/Filters/DateRangeContainer'
import PaginationContainer from './containers/Filters/PaginationContainer'
import { useTranslation } from 'react-i18next'

const BookingPage = () => {
  const [filtersModalOpen, setFiltersModalOpen] = React.useState(false)

  const handleToggleFiltersModal = () => setFiltersModalOpen(!filtersModalOpen)
  const { t } = useTranslation()

  return (
    <>
      <Paper sx={{ width: '100%' }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
            {t('Booking')}
            <Typography variant="caption" sx={{ ml: 1.5 }}></Typography>
          </Typography>
          <Stack direction="row" spacing={4}>
            <DateRangeContainer />
            {/* <FiltersViewContainer /> */}
          </Stack>
          <Tooltip title={t('Filters')}>
            <IconButton onClick={handleToggleFiltersModal}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <FiltersViewContainer />
        <Box sx={{ width: '100%' }}>
          <ScheduleContainer />
        </Box>
        <PaginationContainer />
      </Paper>
      {/* region modals */}
      <FiltersFormContainer
        onClose={handleToggleFiltersModal}
        open={filtersModalOpen}
      />
      {/* endregion modals */}
    </>
  )
}

export default BookingPage
