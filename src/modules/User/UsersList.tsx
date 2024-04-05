import * as React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import Pagination from '@mui/material/Pagination'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

import { useAuth, useEntityModal } from '../../hooks'

import EntityOptionsMenu from '../../components/layouts/EntityOptionsMenu'
import EntityFormModal from '../../components/layouts/EntityFormModal'
import EntityRemoveModal from '../../components/layouts/EntityRemoveModal'

import {
  useGetAllUsersQuery,
  useRemoveUserMutation,
  useUpdateUserMutation,
} from './user'
import UserForm from './UserForm'
import { UserModel } from './UserModel'
import { getUserShortName } from '../../utils'
import { useTranslation } from 'react-i18next'
import { Toolbar } from '@mui/material'
import { SearchField } from 'fields/SearchField'

const UsersList: React.FC = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const widthMax1600 = useMediaQuery('(max-width:1600px)')
  const widthMax1000 = useMediaQuery('(max-width:1000px)')
  const modals = useEntityModal<UserModel>()
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const { data } = useGetAllUsersQuery({ pageNumber: page - 1, text: search })
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Toolbar sx={{ sm: 12, py: 2 }}>
          <SearchField
            value={search}
            label={t('Search')}
            placeholder={t('Type for search')}
            onSearch={(v) => setSearch(v)}
          />
        </Toolbar>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t('ID')}</TableCell>
              {widthMax1600 ? (
                <>
                  <TableCell>{t('Username')}</TableCell>
                  {widthMax1000 ? (
                    <>
                      <TableCell>{t('Name')}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Surname')}</TableCell>
                      <TableCell>{t('Middle name')}</TableCell>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TableCell>{t('Username')}</TableCell>
                  <TableCell>{t('Name')}</TableCell>
                  <TableCell>{t('Surname')}</TableCell>
                  <TableCell>{t('Middle name')}</TableCell>
                  <TableCell>{t('dob')}</TableCell>
                  <TableCell>{t('Gender')}</TableCell>
                  <TableCell>{t('Roles')}</TableCell>
                  <TableCell>{t('individualId')}</TableCell>
                </>
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.content.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" width={70}>
                    {row.id}
                  </TableCell>
                  {widthMax1600 ? (
                    <>
                      <TableCell component="th" scope="row">
                        {row.username}
                      </TableCell>
                      {widthMax1000 ? (
                        <>
                          <TableCell component="th" scope="row">
                            {getUserShortName(row)}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.surname}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.patrName}
                          </TableCell>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <TableCell component="th" scope="row">
                        {row.username}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.surname}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.patrName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.dob}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.gender}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Stack
                          direction="row"
                          flexWrap={'wrap'}
                          maxWidth={'380px'}
                          spacing={1}
                        >
                          {row.roles
                            .filter(
                              (obj, idx, arr) =>
                                idx === arr.findIndex((v) => v.id === obj.id)
                            )
                            .map((role) => (
                              <Tooltip key={role.id} title={role.description}>
                                <Chip label={role.name} size="small" />
                              </Tooltip>
                            ))}
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.individualId}
                      </TableCell>
                    </>
                  )}
                  <TableCell component="th" scope="row" width={60}>
                    <EntityOptionsMenu
                      canEdit={auth.check('admin')}
                      canRemove={auth.check('admin')}
                      onEdit={modals.onEdit({ ...row, password: '' })}
                      onRemove={modals.onRemove(row)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EntityFormModal
        {...modals.edit}
        form={UserForm}
        mutation={useUpdateUserMutation}
        title={t('Update user')}
      />
      <EntityRemoveModal
        {...modals.remove}
        title={t('Do you want to delete a user?')}
        mutation={useRemoveUserMutation}
      />
      {data && (
        <Pagination
          sx={{
            mt: 2,
            mb: 3,
          }}
          count={data.totalPages}
          onChange={handleChangePage}
          page={page}
        />
      )}
    </>
  )
}

export default UsersList
