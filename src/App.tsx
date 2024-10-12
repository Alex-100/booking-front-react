import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import MainLayout from './components/layouts/MainLayout'
import SignInPage from './modules/Auth/SignInPage'
import DashboardPage from './modules/Dashboard/pages/DashboardPage'
import RolesPage from './modules/Role/RolesPage'
import UsersPage from './modules/User/UsersPage'
import LabelsPage from './modules/Label/LabelsPage'
import DepartmentsPage from './modules/Department/DepartmentsPage'
import HospitalsPage from './modules/Hospital/HospitalsPage'
import CompaniesPage from './modules/Company/CompaniesPage'
import RatesPage from './modules/Rate/RatesPage'
import ApplicationSettingsPage from './modules/Application/ApplicationSettingsPage'
import RoomsListPage from './modules/Room/pages/RoomsListPage'
import RoomDetailPage from './modules/Room/pages/RoomDetailPage'
import BookingPage from './modules/Booking/BookingPage'
import { StatisticDepartmentPage } from 'modules/Statistic/pages/StatisticDepartmentPage'
import { StatisticPaidPage } from 'modules/Statistic/pages/StatisticPaidPage'
import { StatisticRoomsPage } from 'modules/Statistic/pages/StatisticRoomsPage'
import { StatisticUsersPage } from 'modules/Statistic/pages/StatisticUsersPage'
import { StatisticCommonPage } from 'modules/Statistic/pages/StatisticCommonPage'
import { StatisticUsersBriefPage } from 'modules/Statistic/pages/StatisticUsersBriefPage'
import { StatisticRoomsStatusPage } from 'modules/Statistic/pages/StatisticRoomsStatusPage'
import { StatisticRoomsLabelPage } from 'modules/Statistic/pages/StatisticRoomsLabel'

const App: React.FC = () => {
  return (
    // @ts-ignore*
    <BrowserRouter>
      <Switch>
        <Route path="/signin" component={SignInPage} exact />
        <MainLayout>
          <Route path="/" exact>
            {localStorage.getItem('auth') ? (
              <Redirect to="/statistic/common" />
            ) : (
              <Redirect to="/signin" />
            )}
          </Route>
          <Route path="/dashboard" component={DashboardPage} exact />
          <Route
            path={'/statistic/common'}
            component={StatisticCommonPage}
            exact
          />
          <Route
            path="/statistic/department"
            component={StatisticDepartmentPage}
            exact
          />
          <Route path={'/statistic/paid'} component={StatisticPaidPage} exact />
          <Route
            path={'/statistic/rooms'}
            component={StatisticRoomsPage}
            exact
          />
          <Route
            path={'/statistic/users'}
            component={StatisticUsersPage}
            exact
          />
          <Route
            path={'/stat/bookingOfUsers/date/brief'}
            component={StatisticUsersBriefPage}
            exact
          />
          <Route
            path={'/statistic/rooms_status'}
            component={StatisticRoomsStatusPage}
            exact
          />
          <Route
            path={'/statistic/rooms_label'}
            component={StatisticRoomsLabelPage}
            exact
          />

          <Route path="/roles" component={RolesPage} exact />
          <Route path="/users" component={UsersPage} exact />
          <Route path="/labels" component={LabelsPage} exact />
          <Route path="/departments" component={DepartmentsPage} exact />
          <Route path="/hospitals" component={HospitalsPage} exact />
          <Route path="/companies" component={CompaniesPage} exact />
          <Route path="/rates" component={RatesPage} exact />
          <Route path="/rooms" component={RoomsListPage} exact />
          <Route path="/rooms/:id" component={RoomDetailPage} exact />
          <Route path="/booking" component={BookingPage} exact />
          <Route
            path="/application"
            component={ApplicationSettingsPage}
            exact
          />
        </MainLayout>
      </Switch>
    </BrowserRouter>
  )
}

export default App
