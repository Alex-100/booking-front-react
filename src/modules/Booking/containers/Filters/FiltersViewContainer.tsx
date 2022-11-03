import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store'
import Chip from '@mui/material/Chip'
import { removeFilter } from '../../state/bookingFiltersSlice'
import { useGetAllDepartmentsQuery } from '../../../Department/department'
import { useGetAllLabelsQuery } from '../../../Label/label'
import { useGetAllHospitalsQuery } from '../../../Hospital/hospital'
import { Box } from '@mui/material'

type FilterKeyType =
  | 'departmentId'
  | 'hospitalId'
  | 'sourceFunding'
  | 'typeOfBooking'
  | 'statusOfBooking'
  | 'labelId'
  | 'test'

const FiltersViewContainer: React.FC = () => {
  const bookingFilters = useAppSelector((state) => state.bookingFilters)
  const dispatch = useAppDispatch()

  const handleRemove = (filter: FilterKeyType) => () => {
    dispatch(removeFilter(filter))
  }

  const { data: departments } = useGetAllDepartmentsQuery({ page: 0 })
  const { data: labels } = useGetAllLabelsQuery(null)
  const { data: hospitals } = useGetAllHospitalsQuery(null)

  const searchDepartment = (departmentId: number) =>
    departments
      ? departments.content.find((v) => v.id === departmentId)?.name
      : departmentId

  const searchLabel = (labelId: number) =>
    labels ? labels.find((v) => v.id === labelId)?.name : labelId

  const searchHospital = (hospitalId: number) =>
    hospitals ? hospitals.find((v) => v.id === hospitalId)?.name : hospitalId

  const caseTitle = (filterKey: FilterKeyType, searchId: any) => {
    switch (filterKey) {
      case 'departmentId':
        return searchDepartment(searchId)
      case 'hospitalId':
        return searchHospital(searchId)
      case 'labelId':
        return searchLabel(searchId)
      default:
        return `${searchId}`
    }
  }

  const bookingFiltersFilter = ([k, v]: [string, any]) =>
    ![
      'pageNumber',
      'pageSize',
      'from',
      'to',
      'sortDirection',
      'sortBy',
    ].includes(k) && !!v

  const getFilterLabel = ([k, v]: [string, any]) =>
    `${k}: ${caseTitle(k as FilterKeyType, v)}`

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        paddingX: '24px',
        alignItems: 'center',
        justifyContent: 'flex-end',
        wordWrap: 'normal',
        // gap: '8px',
        flexWrap: 'wrap',
        marginY: '4px',
      }}
    >
      {Object.entries(bookingFilters)
        .filter(bookingFiltersFilter)
        .map((filter) => (
          <Chip
            onDelete={handleRemove(filter[0] as FilterKeyType)}
            key={filter[0]}
            label={getFilterLabel(filter)}
            sx={{ marginY: '4px', marginX: '4px' }}
          />
        ))}
    </Box>
  )
}

export default FiltersViewContainer
