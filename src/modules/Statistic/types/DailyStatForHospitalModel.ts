import { DailyStatModel } from 'modules/Dashboard/types'
import { DepartmentModel, HospitalModel } from 'types'

export interface DailyStatForHospitalModel {
  hospital: HospitalModel
  department: DepartmentModel
  dailyStat: DailyStatModel
}

export interface DailyStatForHospitalModelWithLabels {
  hospital: HospitalModel
  department: DepartmentModel
  totalDailyStat: DailyStatModel
  freeRooms: Array<{ room: number; place: number }>
  takenRooms: Array<{ room: number; place: number }>
}

// [
//   {
//     "totalDailyStat": {
//       "bookingIn": 0,
//       "bookingOut": 0,
//       "totalPlaces": 0,
//       "repairPlaces": 0,
//       "placesTaken": 0,
//       "placesAvailable": 0,
//       "placesFree": 0
//     },
//     "label": {
//       "id": 0,
//       "name": "string",
//       "description": "string",
//       "color": "string"
//     },
//     "department": {
//       "id": 0,
//       "name": "string",
//       "description": "string",
//       "hospital": {
//         "id": 0,
//         "name": "string"
//       }
//     },
//     "freeRooms": [
//       {
//         "room": 0,
//         "place": 0
//       }
//     ],
//     "takenRooms": [
//       {
//         "room": 0,
//         "place": 0
//       }
//     ],
//     "hospital": {
//       "id": 0,
//       "name": "string"
//     }
//   }
// ]
