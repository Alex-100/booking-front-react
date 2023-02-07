import { createApi } from '@reduxjs/toolkit/query/react'
import { ObjectsList, PaginationParams } from '../../../types'
import { externalAPIQuery, getURLSearchParams } from '../../../utils'

export interface CaseSearchItem {
  caseId: number
  name: string
  partName: string
  surname: string
  dob: string // '2022-09-21'
  individualId: string
  caseType: string
  stageRecord: string
  fundingSource: string
  openCaseDate: string // '2022-09-21'
  closeCaseDate: string // '2022-09-21'
  diagnosisDetailList: [
    {
      id: number
      diagnosisCode: string
      diagnosisName: string
      positionEmployeeId: number
      caseRecord: string
    }
  ]
}

export interface CaseSearchNewItem {
  caseId: number
  name: string
  partName: string
  surname: string
  dob: string // '2022-09-21'
  gender: string
  individualId: string
  phoneNumber: string
  caseType: string
  stageRecord: string
  fundingSource: string
  openCaseDate: string // '2022-09-21'
  closeCaseDate: string // '2022-09-21'
}

export interface PersonItem {
  individualId: string
  name: string
  patrName: string
  surname: string
  birthDate: string // '2022-09-21'
  gender: number
}

export interface EmployeeItem {
  id: number
  individualId: string
  employeeId: string
  companyId: string
  name: string
  surname: string
  patrName: string
  positionRecords: {
    id: number
    departmentId: number
    departmentName: string
    departmentAddress: string
    positionId: number
    positionTitle: string
  }[]
}

type ExternalApiType = {
  externalApiConnectorString: string
  externalApiUsername: string
  externalApiPassword: string
}

interface ExternalSearchServiceParams<T> {
  params: T
  externalApi: ExternalApiType
}

const headers = (externalApi: ExternalApiType) => ({
  Authorization: `Basic ${btoa(
    `${externalApi.externalApiUsername}:${externalApi.externalApiPassword}`
  )}`,
})

type CasesSearchNewParam = {
  text: string
}

export const externalSearchService = createApi({
  reducerPath: 'externalSearchService',
  baseQuery: externalAPIQuery,
  tagTypes: ['ExternalSearch'],
  endpoints: (builder) => ({
    caseSearch: builder.mutation<
      ObjectsList<CaseSearchItem>,
      ExternalSearchServiceParams<PaginationParams>
    >({
      query: ({ params, externalApi }) => ({
        url: `/api_external/case/search?${getURLSearchParams(params)}`,
        headers: headers(externalApi),
        method: 'get',
      }),
    }),
    caseSearchNew: builder.query<Array<CaseSearchNewItem>, CasesSearchNewParam>(
      {
        query: (params) => ({
          url: `/api_external_new/search/person?${getURLSearchParams(params)}`,
          // headers: headers(externalApi),
          method: 'get',
        }),
      }
    ),
    findEmployee: builder.mutation<
      ObjectsList<EmployeeItem>,
      ExternalSearchServiceParams<PaginationParams>
    >({
      query: ({ params, externalApi }) => ({
        url: `/api_external/employees?${getURLSearchParams(params)}`,
        headers: headers(externalApi),
        method: 'get',
      }),
    }),
    findPersonById: builder.mutation<
      PersonItem[],
      ExternalSearchServiceParams<string>
    >({
      query: ({ params, externalApi }) => ({
        url: `/api_external/search/byId/${params}`,
        headers: headers(externalApi),
        method: 'get',
      }),
    }),
  }),
})

export const {
  useCaseSearchMutation,
  useCaseSearchNewQuery,
  useFindPersonByIdMutation,
  useFindEmployeeMutation,
} = externalSearchService
