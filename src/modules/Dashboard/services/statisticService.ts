import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from '../../../utils/baseQuery'
import {
  DailyStatModel,
  DailyStatForHospitalModel,
  DailyStatFilters,
  UsersBookingStatModel,
} from '../types'
import { getURLSearchParams } from '../../../utils'
import { UsersBookingBriefStatProps } from '../types/UsersBookingBriefStat'

export const statisticService = createApi({
  reducerPath: 'statisticService',
  baseQuery,
  tagTypes: ['Statistic'],
  endpoints: (builder) => ({
    getDailyStat: builder.query<DailyStatModel, DailyStatFilters>({
      query: (params) => `stat/daily/all?${getURLSearchParams(params)}`,
    }),
    getDailyStatForHospital: builder.query<
      DailyStatForHospitalModel[],
      DailyStatFilters
    >({
      query: (params) => `stat/daily/hospital?${getURLSearchParams(params)}`,
    }),
    getUsersBookingBriefStat: builder.query<
      UsersBookingStatModel[],
      UsersBookingBriefStatProps
    >({
      query: (params) =>
        `/stat/bookingOfUsers/date/brief?${getURLSearchParams(params)}`,
    }),
    getUsersBookingStat: builder.query<UsersBookingStatModel[], null>({
      query: () => `stat/bookingOfUsers/all/brief`,
    }),
  }),
})

export const {
  useGetDailyStatQuery,
  useGetDailyStatForHospitalQuery,
  useGetUsersBookingBriefStatQuery,
  useGetUsersBookingStatQuery,
} = statisticService
