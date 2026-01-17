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
    const cookies = document.cookie;
    const cookieToken = cookies.match(/accessToken=([^;]+)/);
    
    var token = '{}';

    if (cookieToken) {
      token = cookieToken[1];
    }
    const accessToken = token;

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
    const cookies = document.cookie;
    const cookieToken = cookies.match(/refreshToken=([^;]+)/);

    var token = '{}';

    if (cookieToken) {
      token = cookieToken[1];
    }

    const refreshToken = token;
    try {
      const response = await axios({
        method: 'get',
        url: '/users/token/refresh',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      const jwtToken = response.data;
      document.cookie = `accessToken=${jwtToken.access_token}`
      document.cookie = `refreshToken=${jwtToken.refresh_token}`
      window.dispatchEvent(new Event('auth_info_changed'))
      result = await fetchQuery(args, api, extraOptions)
    } catch (err) {
      // @ts-ignore
      if (err.request.status === 403) {
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        location.href = '/signin'
      }
    }
  }

  if (result.error) {
  }

  return result
}

export default baseQuery
