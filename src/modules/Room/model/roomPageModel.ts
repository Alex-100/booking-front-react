import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface RoomFiltersBlock {
  hospitalId: undefined
  labelId: undefined
  departmentId: undefined
}

interface RoomPageModel {
  page: number
  pageSize: number
  filters: RoomFiltersBlock
}

const initialState: RoomPageModel = {
  page: 0,
  pageSize: 10,
  filters: {
    hospitalId: undefined,
    labelId: undefined,
    departmentId: undefined,
  },
}

export const roomPageSlice = createSlice({
  name: 'roomPageModel',
  initialState,
  reducers: {
    setRoomPage: (state, { payload }: PayloadAction<number>) => {
      state.page = payload
    },
    setRoomPageSize: (state, { payload }: PayloadAction<number>) => {
      state.page = 0
      state.pageSize = payload
    },
    setRoomPageFilters: (
      state,
      { payload }: PayloadAction<RoomFiltersBlock>
    ) => {
      state.filters = payload
      state.page = 0
    },
  },
})

export const {
  setRoomPage,
  setRoomPageSize,
  setRoomPageFilters,
} = roomPageSlice.actions
export default roomPageSlice.reducer
