import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { BookingSearchParams } from '../types/BookingSearchParams'
import { DATE_FORMAT_TEMPLATE } from '../../../constants'
import dayjs from 'dayjs'
import * as jose from 'jose'

interface BookingFiltersState extends BookingSearchParams {}

const initialState: BookingFiltersState = {
  pageNumber: 0,
  pageSize: 10,
  from: dayjs().startOf('day').format(DATE_FORMAT_TEMPLATE),
  to: dayjs().startOf('day').add(30, 'days').format(DATE_FORMAT_TEMPLATE),
  sortBy: 'department',
  sortDirection: 'ASC',
}

export const loadInitialStateFilter = () => {
  const storedToken = JSON.parse(localStorage.getItem('auth') || '{}')
    .access_token

  const jwt = jose.decodeJwt(storedToken)

  const username = jwt.sub

  if (username) {
    const filters = localStorage.getItem(`filters_${username}`)
    if (filters === null) {
      return initialState
    } else {
      const res = JSON.parse(filters) as BookingFiltersState
      return {
        ...initialState,
        ...res,
      }
    }
  } else {
    return initialState
  }
  //  return initialState
}

const bookingFiltersSlice = createSlice({
  name: 'bookingFilters',
  initialState,
  reducers: {
    setDateRange(
      state,
      action: PayloadAction<{ startDate?: string; endDate?: string }>
    ) {
      console.log('SETTING DATE IS', action.payload)
      if (action.payload.startDate) state.from = action.payload.startDate
      if (action.payload.endDate) state.to = action.payload.endDate
    },
    filterByRoom(
      state,
      {
        payload,
      }: PayloadAction<{
        startDate: string
        endDate: string
        roomIdList: number
      }>
    ) {
      state.from = payload.startDate
      state.to = payload.endDate
      state.roomIdList = payload.roomIdList
    },
    clearRoomFilter(state) {
      state.roomIdList = undefined
    },
    setSearch(state, action: PayloadAction<string>) {
      state.text = action.payload
    },
    setFilters(
      state,
      action: PayloadAction<
        Omit<BookingSearchParams, 'enteringDateTo' | 'enteringDateFrom'>
      >
    ) {
      state.departmentId = action.payload.departmentId
      state.hospitalId = action.payload.hospitalId
      state.sourceFunding = action.payload.sourceFunding
      state.typeOfBooking = action.payload.typeOfBooking
      state.statusOfBooking = action.payload.statusOfBooking
      state.labelId = action.payload.labelId
      state.test = action.payload.test
      state.pageNumber = 0

      const storedToken = JSON.parse(localStorage.getItem('auth') || '{}')
        .access_token

      const jwt = jose.decodeJwt(storedToken)
      const username = jwt.sub
      if (username) {
        localStorage.setItem(
          `filters_${username}`,
          JSON.stringify({
            departmentId: action.payload.departmentId,
            hospitalId: action.payload.hospitalId,
            sourceFunding: action.payload.sourceFunding,
            typeOfBooking: action.payload.typeOfBooking,
            statusOfBooking: action.payload.statusOfBooking,
            labelId: action.payload.labelId,
          })
        )
      }
    },
    setPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload
      state.pageNumber = 0
    },
    removeFilter(
      state,
      action: PayloadAction<
        | 'departmentId'
        | 'hospitalId'
        | 'sourceFunding'
        | 'typeOfBooking'
        | 'statusOfBooking'
        | 'labelId'
        | 'test'
      >
    ) {
      state[action.payload] = undefined
      state.pageNumber = 0

      const storedToken = JSON.parse(localStorage.getItem('auth') || '{}')
        .access_token

      const jwt = jose.decodeJwt(storedToken)
      const username = jwt.sub
      if (username) {
        localStorage.setItem(
          `filters_${username}`,
          JSON.stringify({
            departmentId: state.departmentId,
            hospitalId: state.hospitalId,
            sourceFunding: state.sourceFunding,
            typeOfBooking: state.typeOfBooking,
            statusOfBooking: state.statusOfBooking,
            labelId: state.labelId,
          })
        )
      }
    },
  },
})

export const {
  setDateRange,
  filterByRoom,
  clearRoomFilter,
  setFilters,
  setPageNumber,
  setPageSize,
  setSearch,
  removeFilter,
} = bookingFiltersSlice.actions
export default bookingFiltersSlice.reducer
