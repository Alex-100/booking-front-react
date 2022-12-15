import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAllLabelsQuery } from 'services'
import { useAppSelector } from 'store'
import { PaidInfo } from '../containers/PaidInfo'
import { useGetPaidStatInfoQuery } from '../services/statisticServiceN'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export const StatisticPaidPage = () => {
  const { t } = useTranslation()
  const { data: labels } = useGetAllLabelsQuery(null)

  const [selectedPaidLabels, setSelectedPaidLabels] = useState<Array<string>>(
    []
  )
  const [selectedUnpaidLabels, setSelectedUnpaidLabels] = useState<
    Array<string>
  >([])

  const handleSelectPaidLabels = (
    event: SelectChangeEvent<typeof selectedPaidLabels>
  ) => {
    const {
      target: { value },
    } = event
    setSelectedPaidLabels(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSelectUnpaidLabels = (
    event: SelectChangeEvent<typeof selectedPaidLabels>
  ) => {
    const {
      target: { value },
    } = event
    setSelectedUnpaidLabels(
      typeof value === 'string' ? value.split(',') : value
    )
  }

  const d = useAppSelector((state) => state.dailyStatFilters)
  const { data } = useGetPaidStatInfoQuery({
    date: d.date,
    paidLabelsId: selectedPaidLabels.map((v) => (v as unknown) as number),
    unpaidLabelsId: selectedUnpaidLabels.map((v) => (v as unknown) as number),
  })

  const paidContainersList = useMemo(
    () => (data !== undefined ? data.paidContainersList : []),
    [data]
  )

  const unpaidConatinersList = useMemo(
    () => (data !== undefined ? data.unpaidContainersList : []),
    [data]
  )

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            {t('Statistic')}. {t('statistic.pay')}
          </Typography>
        </Grid>

        <Toolbar sx={{ sm: 6, py: 1, my: 1, width: '100%' }} component={Paper}>
          <Grid container spacing={2}>
            <Grid item lg={6} xs={12} md={6} sm={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                <InputLabel>{t('Paid')}</InputLabel>
                <Select
                  label={t('Paid')}
                  multiple
                  value={selectedPaidLabels}
                  onChange={handleSelectPaidLabels}
                  input={<OutlinedInput label={t('Paid')} />}
                  renderValue={(selected) =>
                    labels
                      ?.filter((label) =>
                        selected.includes((label.id as unknown) as string)
                      )
                      .map((v) => v.name)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                >
                  {labels?.map((label) => (
                    <MenuItem
                      key={label.id}
                      value={label.id}
                      disabled={
                        selectedUnpaidLabels.indexOf(
                          (label.id as unknown) as string
                        ) > -1
                      }
                    >
                      <Checkbox
                        checked={
                          selectedPaidLabels.indexOf(
                            (label.id as unknown) as string
                          ) > -1
                        }
                      />
                      <ListItemText primary={label.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item lg={6} xs={12} md={6} sm={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                <InputLabel>{t('Unpaid')}</InputLabel>
                <Select
                  label={t('Unpaid')}
                  multiple
                  value={selectedUnpaidLabels}
                  onChange={handleSelectUnpaidLabels}
                  input={<OutlinedInput label={t('Unpaid')} />}
                  renderValue={(selected) =>
                    labels
                      ?.filter((label) =>
                        selected.includes((label.id as unknown) as string)
                      )
                      .map((v) => v.name)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                >
                  {labels?.map((label) => (
                    <MenuItem
                      key={label.id}
                      value={label.id}
                      disabled={
                        selectedPaidLabels.indexOf(
                          (label.id as unknown) as string
                        ) > -1
                      }
                    >
                      <Checkbox
                        checked={
                          selectedUnpaidLabels.indexOf(
                            (label.id as unknown) as string
                          ) > -1
                        }
                      />
                      <ListItemText primary={label.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Toolbar>

        <PaidInfo
          title={t('Paid')}
          containerList={paidContainersList}
          total={data?.paidTotal}
        />
        <PaidInfo
          title={t('Unpaid')}
          containerList={unpaidConatinersList}
          total={data?.unpaidTotal}
        />
      </Grid>
    </>
  )
}
