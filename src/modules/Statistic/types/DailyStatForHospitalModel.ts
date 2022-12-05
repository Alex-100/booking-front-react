import { DailyStatModel } from 'modules/Dashboard/types'
import { DepartmentModel, HospitalModel } from 'types'

export interface DailyStatForHospitalModel {
  hospital: HospitalModel
  department: DepartmentModel
  dailyStat: DailyStatModel
}
