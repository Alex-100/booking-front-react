export type DailyStatFilters = {
  date: string
  departmentsId?: Array<string>
  hospitalId: string
}

export type DailyStatFiltersWithLabels = {
  date: string
  departmentsId: Array<string>
  labelsId: Array<string>
  hoursBetweenEnteringAndLeaving: number
}
