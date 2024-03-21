import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import axios from 'axios'
// import { API_URL } from '../constants'

const fetchQuery = fetchBaseQuery({
  baseUrl: `/api/`,
  prepareHeaders: (headers) => {
    const accessToken = JSON.parse(localStorage.getItem('auth') || '{}')
      .access_token

    headers.set('Authorization', `Bearer ${accessToken}`)

    return headers
  },
})

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await fetchQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    const refreshToken = JSON.parse(localStorage.getItem('auth') || '{}')
      .refresh_token
    try {
      const response = await axios({
        method: 'get',
        url: '/users/token/refresh',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      localStorage.setItem('auth', JSON.stringify(response.data))
      window.dispatchEvent(new Event('auth_info_changed'))
      result = await fetchQuery(args, api, extraOptions)
    } catch (err) {
      // @ts-ignore
      if (err.request.status === 403) {
        localStorage.removeItem('auth')
        location.href = '/signin'
      }
    }
  }

  if (result.error) {
  }

  return result
}

export default baseQuery
