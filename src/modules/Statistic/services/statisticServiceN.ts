import { createApi } from '@reduxjs/toolkit/query/react'
import { getURLSearchParams } from 'utils'
import { DailyStatFilters } from '../types/DailyStatFilters'
import { DailyStatForHospitalModel } from '../types/DailyStatForHospitalModel'
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
        params.departmentId === 0
          ? `stat/daily/hospital/all?${getURLSearchParams({
              date: params.date,
            })}`
          : `stat/daily/hospital/department?${getURLSearchParams(params)}`,
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
  useGetStatForPlacesQuery,
  useGetPaidStatInfoQuery,
} = statisticServiceN
