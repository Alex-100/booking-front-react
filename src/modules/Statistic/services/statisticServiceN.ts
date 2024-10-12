import { createApi } from '@reduxjs/toolkit/query/react'
import { getURLSearchParams } from 'utils'
import {
  DailyStatFilters,
  DailyStatFiltersWithLabels,
} from '../types/DailyStatFilters'
import {
  DailyStatForHospitalModel,
  DailyStatForHospitalModelWithLabels,
} from '../types/DailyStatForHospitalModel'
import baseQuery from '../../../utils/baseQuery'
import { PlaceStatInfo } from '../types/PlaceStatInfo'
import { PaidStatInfo } from '../types/PaidStatInfo'
import { PaidStatFilters } from '../types/PaidStatFilters'

export const statisticServiceN = createApi({
  reducerPath: 'statisticServiceN',
  baseQuery,
  tagTypes: ['StatisticN'],
  endpoints: (builder) => ({
    getDailyStatForHospitalN: builder.query<
      DailyStatForHospitalModel[] | DailyStatForHospitalModel,
      DailyStatFilters
    >({
      query: (params) =>
        params.hospitalId === ''
          ? `stat/daily/hospital/all?${getURLSearchParams({
              date: params.date,
            })}`
          : `stat/daily/hospital/departments?${getURLSearchParams({
              date: params.date,
              departmentsId: params.departmentsId,
            })}`,
    }),
    getDailyStatForHospitalByLabel: builder.query<
      | DailyStatForHospitalModelWithLabels[]
      | DailyStatForHospitalModelWithLabels,
      DailyStatFiltersWithLabels
    >({
      query: (params) => {
        const p = new URLSearchParams()
        p.append('date', params.date)
        params.departmentsId.forEach((v) => {
          p.append('departmentsId', v)
        })
        params.labelsId.forEach((v) => {
          p.append('labelsId', v)
        })
        p.append(
          'hoursBetweenEnteringAndLeaving',
          (params.hoursBetweenEnteringAndLeaving as unknown) as string
        )
        console.log('params', params, p)
        return `stat/daily/hospital/departments/labels?${p.toString()}`
      },
    }),
    getStatForPlaces: builder.query<PlaceStatInfo[], null>({
      query: () => 'stat/places',
    }),
    getPaidStatInfo: builder.query<PaidStatInfo, PaidStatFilters>({
      query: (params) =>
        `/stat/daily/label/group?${getURLSearchParams(params)}`,
    }),
  }),
})

export const {
  useGetDailyStatForHospitalNQuery,
  useGetDailyStatForHospitalByLabelQuery,
  useGetStatForPlacesQuery,
  useGetPaidStatInfoQuery,
} = statisticServiceN
