import { LabelModel } from 'types'
import { DailyStatModel } from './DailyStatModel'

export interface PaidStatInfo {
  paidTotal: DailyStatModel
  paidContainersList: {
    label: LabelModel
    totalDailyStat: DailyStatModel
  }[]
  unpaidTotal: DailyStatModel
  unpaidContainersList: {
    label: LabelModel
    totalDailyStat: DailyStatModel
  }[]
}
// {
//     "paidContainersList": [
//       {
//         "totalDailyStat": {
//           "bookingIn": 5,
//           "bookingOut": 5,
//           "totalPlaces": 4,
//           "repairPlaces": 5,
//           "placesTaken": 5,
//           "placesAvailable": -6,
//           "placesFree": -11
//         },
//         "label": {
//           "id": 710,
//           "name": "label_pink",
//           "description": null,
//           "color": "#e91e63"
//         }
//       }
//     ],
//     "paidTotal": {
//       "bookingIn": 5,
//       "bookingOut": 5,
//       "totalPlaces": 4,
//       "repairPlaces": 5,
//       "placesTaken": 5,
//       "placesAvailable": -6,
//       "placesFree": -11
//     },
//     "unpaidContainersList": [],
//     "unpaidTotal": {
//       "bookingIn": 0,
//       "bookingOut": 0,
//       "totalPlaces": 0,
//       "repairPlaces": 0,
//       "placesTaken": 0,
//       "placesAvailable": 0,
//       "placesFree": 0
//     }
//   }
