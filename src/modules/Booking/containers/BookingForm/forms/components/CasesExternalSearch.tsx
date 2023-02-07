import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import { useDebounce } from 'hooks'
// import { useGetApplicationQuery } from 'modules/Application/applicationService'
import {
  CaseSearchNewItem,
  useCaseSearchNewQuery,
} from 'modules/Booking/state/externalSearchService'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CasesExternalSearchProps {
  onSelect: (v: CaseSearchNewItem) => void
}

export const CasesExternalSearch = ({ onSelect }: CasesExternalSearchProps) => {
  const { t } = useTranslation()
  const [value, setValue] = useState<string>('')
  const searchString = useDebounce(value, 750)

  // const applicationQuery = useGetApplicationQuery(null)
  const { data, isLoading } = useCaseSearchNewQuery({
    text: searchString,
  })

  const loadedData = useMemo<Array<CaseSearchNewItem>>(
    () => (data !== undefined ? data : []),
    [data]
  )
  // useEffect(() => {
  //   if (!applicationQuery.data) return
  //   casesSearch({
  //     params: {
  //       text: searchString,
  //       pageSize: 20,
  //       pageNumber: 0,
  //       sortBy: 'openCaseDate',
  //     },
  //     externalApi: applicationQuery.data,
  //   })
  // }, [searchString])

  return (
    <>
      <Autocomplete
        id="external_user_search"
        options={loadedData}
        fullWidth
        loading={isLoading}
        noOptionsText={t('Nothing find')}
        loadingText={t('Searching')}
        inputValue={value}
        onInputChange={(_, v) => setValue(v)}
        onChange={(_, v) => v && onSelect(v)}
        filterOptions={(v) => v}
        getOptionLabel={(option) =>
          option.surname +
          ' ' +
          option.name +
          ' ' +
          option.partName +
          ' ' +
          option.individualId
        }
        renderOption={(props, option) => (
          <li {...props}>
            {option.surname} {option.name} {option.partName}
            <Typography variant="caption" color="text.secondary" ml={3}>
              {option.gender === 'MALE' && <>{t('Male')}</>}
              {option.gender === 'FEMALE' && <>{t('Female')}</>}
            </Typography>
            <Typography variant="caption" color="text.secondary" ml={3}>
              {option.dob}
            </Typography>
            <Typography variant="caption" color="text.secondary" ml={3}>
              {option.individualId}
            </Typography>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('Search user in external service')}
            placeholder={t('Name, surname or patronymic or id')}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  )
}
