import { configureStore } from '@reduxjs/toolkit'
import { reducer as formReducer } from 'redux-form'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import {
  roleApi,
  userApi,
  companyApi,
  labelApi,
  hospitalApi,
  departmentApi,
} from './services'
import { comboRateService, rateComponentService } from './modules/Rate/services'
import { applicationApi } from './modules/Application/applicationService'
import { roomService } from './modules/Room/services/roomService'
import { bookingService } from './modules/Booking/state/bookingService'
import bookingFiltersSlice from './modules/Booking/state/bookingFiltersSlice'
import dailyStatFiltersSlice from './modules/Dashboard/slices/dailyStatFiltersSlice'
import { statisticService } from './modules/Dashboard/services/statisticService'
import { externalSearchService } from './modules/Booking/state/externalSearchService'
import { statisticServiceN } from 'modules/Statistic/services/statisticServiceN'

export const store = configureStore({
  reducer: {
    form: formReducer,
    bookingFilters: bookingFiltersSlice,
    dailyStatFilters: dailyStatFiltersSlice,
    [roleApi.reducerPath]: roleApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
    [hospitalApi.reducerPath]: hospitalApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [comboRateService.reducerPath]: comboRateService.reducer,
    [rateComponentService.reducerPath]: rateComponentService.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [roomService.reducerPath]: roomService.reducer,
    [bookingService.reducerPath]: bookingService.reducer,
    [statisticService.reducerPath]: statisticService.reducer,
    [statisticServiceN.reducerPath]: statisticServiceN.reducer,
    [externalSearchService.reducerPath]: externalSearchService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      roleApi.middleware,
      labelApi.middleware,
      hospitalApi.middleware,
      departmentApi.middleware,
      companyApi.middleware,
      userApi.middleware,
      comboRateService.middleware,
      rateComponentService.middleware,
      applicationApi.middleware,
      roomService.middleware,
      bookingService.middleware,
      statisticService.middleware,
      externalSearchService.middleware
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
