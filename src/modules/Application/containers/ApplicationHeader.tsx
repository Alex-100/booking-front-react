import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useGetApplicationQuery } from '../applicationService'

const ApplicationHeader: React.FC = () => {
  const { data } = useGetApplicationQuery(null)

  useEffect(() => {
    if (data && data.nameOfAppTitle) {
      document.title = data.nameOfAppTitle
    }
  }, [data])

  return (
    <Box component="div">
      <Typography variant="h6">{data && data.nameOfAppTitle}</Typography>
      <Typography>{data && data.nameOfAppSubtitle}</Typography>
    </Box>
  )
}

export default ApplicationHeader
