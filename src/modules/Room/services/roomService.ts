import { createApi } from '@reduxjs/toolkit/query/react'
import type { PlaceModel, RoomModel } from '../types'
import baseQuery from '../../../utils/baseQuery'
import {
  DepartmentModel,
  HospitalModel,
  LabelModel,
  ObjectsList,
  PaginationParams,
} from '../../../types'
import { GroupRoomsForm } from '../types'

const prepareObj = (v: object | string) =>
  typeof v === 'string' ? JSON.parse(String(v)) : v

const getRoomURL = (room: RoomModel) =>
  `${room.roomNumber}/${room.capacity}/${prepareObj(room.department).id}/${
    prepareObj(room.label).id
  }`

const getRoomBody = (room: RoomModel) => ({
  ...room,
  department: prepareObj(room.department),
  label: prepareObj(room.label),
  places: undefined,
})

interface RemoveRoomPlaceParams {
  roomId: RoomModel['id']
  placeId: PlaceModel['id']
}

interface RoomsSearchParams extends PaginationParams {
  labelId?: LabelModel['id'] | null
  hospitalId?: HospitalModel['id'] | null
  departmentId?: DepartmentModel['id'] | null
}

interface PlaceQueryInfoParams {
  labelId?: number
  hospitalId?: number
  departmentId?: number
}

interface PalaceSelectorParams extends PlaceQueryInfoParams {
  numberOfPlaces: number
}

interface PlacesQueryCount {
  totalPlaces: number
}

export const roomService = createApi({
  reducerPath: 'roomService',
  baseQuery,
  tagTypes: ['Room'],
  endpoints: (builder) => ({
    getAllRooms: builder.query<ObjectsList<RoomModel>, RoomsSearchParams>({
      query: (params) =>
        `room/all?${new URLSearchParams(params as any).toString()}`,
      providesTags: ['Room'],
    }),
    getPlacesCount: builder.query<PlacesQueryCount, PlaceQueryInfoParams>({
      query: (params) =>
        `room/total/places?${new URLSearchParams(params as any).toString()}`,
    }),
    getPlaceListForBooking: builder.query<Array<number>, PalaceSelectorParams>({
      query: (params) =>
        `/room/list?${new URLSearchParams(params as any).toString()}`,
    }),
    getRoom: builder.query<
      RoomModel,
      Partial<RoomModel> & Pick<RoomModel, 'id'>
    >({
      query: (room) => `room/${room.id}`,
      providesTags: ['Room'],
    }),
    getRoomByPlaceId: builder.mutation<RoomModel, number>({
      query: (placeId) => `room/place/${placeId}`,
      invalidatesTags: ['Room'],
    }),
    createRoom: builder.mutation<null, RoomModel>({
      query: (room) => ({
        url: `room/create/${getRoomURL(room)}`,
        method: 'post',
        body: getRoomBody(room),
      }),
      invalidatesTags: ['Room'],
    }),
    createRoomGroup: builder.mutation<null, GroupRoomsForm>({
      query: (group) => ({
        url: `room/create/group/${group.capacity}/${group.firstNumber}/${
          group.increment
        }/${group.lastNumber}/${prepareObj(group.department).id}/${
          prepareObj(group.label).id
        }`,
        method: 'post',
      }),
      invalidatesTags: ['Room'],
    }),
    removeRoom: builder.mutation<
      null,
      Partial<RoomModel> & Pick<RoomModel, 'id'>
    >({
      query: (room) => ({
        url: `room/delete/${room.id}`,
        method: 'delete',
      }),
      invalidatesTags: ['Room'],
    }),
    removeRoomsArray: builder.mutation<null, number[]>({
      query: (ids) => ({
        url: `room/delete/array?${new URLSearchParams({
          ids,
        } as any).toString()}`,
        method: 'delete',
      }),
      invalidatesTags: ['Room'],
    }),
    updateRoom: builder.mutation<null, RoomModel>({
      query: (room) => ({
        url: `room/update/${room.id}/${room.roomNumber}/${
          prepareObj(room.department).id
        }/${prepareObj(room.label).id}`,
        method: 'put',
        body: { ...getRoomBody(room), places: undefined },
      }),
      invalidatesTags: ['Room'],
    }),
    addRoomPlace: builder.mutation<
      null,
      Partial<RoomModel> & Pick<RoomModel, 'id'>
    >({
      query: (room) => ({
        url: `room/${room.id}/addPlace`,
        method: 'put',
      }),
      invalidatesTags: ['Room'],
    }),
    removeRoomPlace: builder.mutation<null, RemoveRoomPlaceParams>({
      query: ({ roomId, placeId }) => ({
        url: `room/${roomId}/deletePlace/${placeId}`,
        method: 'delete',
      }),
      invalidatesTags: ['Room'],
    }),
  }),
})

export const {
  useGetAllRoomsQuery,
  useGetPlacesCountQuery,
  useGetRoomQuery,
  useCreateRoomMutation,
  useCreateRoomGroupMutation,
  useRemoveRoomMutation,
  useRemoveRoomsArrayMutation,
  useUpdateRoomMutation,
  useAddRoomPlaceMutation,
  useRemoveRoomPlaceMutation,
  useGetRoomByPlaceIdMutation,
  // useGetRoomByPlaceIdQuery,
} = roomService
