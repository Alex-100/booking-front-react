import { createApi } from '@reduxjs/toolkit/query/react'
import { getURLSearchParams } from 'utils'
import { DailyStatFilters } from '../types/DailyStatFilters'
import { DailyStatForHospitalModel } from '../types/DailyStatForHospitalModel'
import baseQuery from '../../../utils/baseQuery'
import { PlaceStatInfo } from '../types/PlaceStatInfo'

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
  }),
})

export const {
  useGetDailyStatForHospitalNQuery,
  useGetStatForPlacesQuery,
} = statisticServiceN
