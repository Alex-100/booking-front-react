import { Box, TableCell, TableRow, Typography } from '@mui/material'

interface DepartmentRowProps {
  departmentName: string
  hospitalName: string
  datesCount: number
}

export const DepartmentRow = ({
  departmentName,
  hospitalName,
  datesCount,
}: DepartmentRowProps) => (
  <TableRow>
    <TableCell
      sx={{
        bgcolor: (theme: any) => theme.palette.grey.A200,
        position: 'sticky',
        minWidth: 140,
        maxWidth: 180,
        height: 35,
        left: 0,
        pt: 0,
        pb: 0,
        overflowX: 'visible',
      }}
    >
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            position: 'absolute',
            top: '-17.5px',
            width: 'max-content',
            lineHeight: '35px',
          }}
        >
          {departmentName}
          <Typography variant="caption" ml={2}>
            ({hospitalName})
          </Typography>
        </Typography>
      </Box>
    </TableCell>
    <TableCell
      colSpan={datesCount}
      sx={{
        bgcolor: (theme: any) => theme.palette.grey.A200,
        borderRight: 1,
        borderColor: 'divider',
      }}
    />
  </TableRow>
)
