import * as React from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import MUILink from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/PeopleOutlined'
import MenuIcon from '@mui/icons-material/MenuOutlined'
import LayersIcon from '@mui/icons-material/LayersOutlined'
import LabelIcon from '@mui/icons-material/LabelOutlined'
import ApartmentIcon from '@mui/icons-material/ApartmentOutlined'
import CottageIcon from '@mui/icons-material/CottageOutlined'
import BadgeIcon from '@mui/icons-material/BadgeOutlined'
import DashboardIcon from '@mui/icons-material/DashboardOutlined'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableOutlined'
import { Link } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import LocaleMenu from './LocaleMenu'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useAuth } from '../../hooks'
import ApplicationHeader from '../../modules/Application/containers/ApplicationHeader'
import ApplicationFooter from '../../modules/Application/containers/ApplicationFooter'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Logout from '@mui/icons-material/Logout'
import { useGetUserByUsernameQuery } from '../../modules/User/user'
import { getUserShortName } from '../../utils'
import { Skeleton } from '@mui/lab'
import { useTranslation } from 'react-i18next'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ExternalLink } from 'components/external_link'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const CustomDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

const mdTheme = createTheme()

const StatisticSubMemu = () => {
  const { t } = useTranslation()
  return (
    <>
      <List>
        <Link to="/statistic/common">
          <ListItemButton selected={location.pathname === '/statistic/common'}>
            <ListItemIcon />
            <ListItemText primary={t('statistic.common')} />
          </ListItemButton>
        </Link>
        <Link to="/statistic/department">
          <ListItemButton
            selected={location.pathname === '/statistic/department'}
          >
            <ListItemIcon />
            <ListItemText primary={t('statistic.department')} />
          </ListItemButton>
        </Link>
        <Link to="/statistic/paid">
          <ListItemButton selected={location.pathname === '/statistic/paid'}>
            <ListItemIcon />
            <ListItemText primary={t('statistic.pay')} />
          </ListItemButton>
        </Link>
        <Link to="/statistic/rooms">
          <ListItemButton selected={location.pathname === '/statistic/rooms'}>
            <ListItemIcon />
            <ListItemText primary={t('statistic.rooms')} />
          </ListItemButton>
        </Link>
        <Link to="/statistic/rooms_status">
          <ListItemButton
            selected={location.pathname === '/statistic/rooms_status'}
          >
            <ListItemIcon />
            <ListItemText primary={t('statistic.rooms_status')} />
          </ListItemButton>
        </Link>
        <Link to="/statistic/users">
          <ListItemButton selected={location.pathname === '/statistic/users'}>
            <ListItemIcon />
            <ListItemText primary={t('statistic.users')} />
          </ListItemButton>
        </Link>
        <Link to="/stat/bookingOfUsers/date/brief">
          <ListItemButton
            selected={location.pathname === '/stat/bookingOfUsers/date/brief'}
          >
            <ListItemIcon />
            <ListItemText primary={t('statistic.users_brief')} />
          </ListItemButton>
        </Link>
      </List>
    </>
  )
}

const Dashboard: React.FC = ({ children }) => {
  // const widthMax950 = useMediaQuery('(max-width:950px)')
  const widthMax700 = useMediaQuery('(max-width:700px)')
  const [open, setOpen] = React.useState(!widthMax700)
  const toggleDrawer = () => {
    setOpen(!open)
  }
  const auth = useAuth()
  const { data: user } = useGetUserByUsernameQuery(auth.user.username)

  const handleLogout = () => {
    auth.logout()
  }

  const Drawer = widthMax700 ? MuiDrawer : CustomDrawer

  const { t } = useTranslation()
  const isAdmin = React.useMemo(
    () => (user?.roles.find((role) => role.name === 'admin') ? true : false),
    [user]
  )

  const shortUserName = React.useMemo(
    () => (user ? getUserShortName(user) : ''),
    [user]
  )

  React.useEffect(() => {
    console.log('CURRENT USER', user)
  }, [user])

  const [
    anchorElStatistic,
    setAnchorElStatistic,
  ] = React.useState<HTMLDivElement | null>(null)
  const [openedStatisticMenu, setOpenedStatisticMenu] = React.useState(false)

  const openStatisticMenu = Boolean(anchorElStatistic)

  const handleStateStatisticMenu = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!open) {
      setAnchorElStatistic(event.currentTarget)
    }
    setOpenedStatisticMenu((state) => !state)
  }

  const handleCloseStatisticPopover = () => {
    setAnchorElStatistic(null)
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {widthMax700 && (
          <AppBar position="absolute">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }}>
                <ApplicationHeader />
              </Box>
            </Toolbar>
          </AppBar>
        )}
        <Drawer
          open={open}
          variant={widthMax700 ? undefined : 'permanent'}
          onClose={toggleDrawer}
          sx={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: '100vh' }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <ApplicationHeader />
            </Box>
          </Toolbar>
          <Box sx={{ p: 1, justifyItems: 'center' }}>
            <ExternalLink />
          </Box>

          <Box sx={{ m: 2 }}>
            <Stack
              sx={{
                bgcolor: (theme) => theme.palette.grey.A100,
                width: '100%',
                borderRadius: 2,
                p: open ? 2 : 0,
                height: 110,
                ...(!open && {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }),
              }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center" pb={1.5}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user ? user.username[0].toUpperCase() : '@'}
                </Avatar>
                {open && (
                  <Stack>
                    <Typography variant="subtitle2">
                      {user ? (
                        shortUserName
                      ) : (
                        <Skeleton variant="text" width={100} />
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user ? (
                        `@${user.username}`
                      ) : (
                        <Skeleton variant="text" width={70} />
                      )}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {open && (
                <Stack direction="row" justifyContent="space-between">
                  <LocaleMenu />
                  <MUILink
                    fontSize="small"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={handleLogout}
                  >
                    <Logout fontSize="small" sx={{ mr: 0.5 }} />
                    {t('Logout')}
                  </MUILink>
                </Stack>
              )}
            </Stack>
          </Box>
          <List
            component="nav"
            onClick={() => widthMax700 && setOpen(false)}
            sx={{ width: '240px' }}
          >
            <ListItemButton
              selected={
                location.pathname === '/dashboard' ||
                location.pathname === '/statistic/common' ||
                location.pathname === '/statistic/department' ||
                location.pathname === '/statistic/paid' ||
                location.pathname === '/statistic/rooms' ||
                location.pathname === '/statistic/rooms_status' ||
                location.pathname === '/statistic/users' ||
                location.pathname === '/stat/bookingOfUsers/date/brief'
              }
              onClick={handleStateStatisticMenu}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={t('Statistic')} />
              {openedStatisticMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Popover
              id={''}
              open={openStatisticMenu}
              anchorEl={anchorElStatistic}
              onClose={handleCloseStatisticPopover}
              sx={{ ml: '4rem', pr: '2rem' }}
              onClick={handleCloseStatisticPopover}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <StatisticSubMemu />
            </Popover>
            <Collapse
              timeout={'auto'}
              in={openedStatisticMenu && open}
              unmountOnExit
            >
              <StatisticSubMemu />
            </Collapse>

            <Divider sx={{ my: 1 }} />

            {isAdmin && (
              <Link to="/roles">
                <ListItemButton selected={location.pathname === '/roles'}>
                  <ListItemIcon>
                    <BadgeIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Roles')} />
                </ListItemButton>
              </Link>
            )}

            {isAdmin && (
              <Link to="/users">
                <ListItemButton selected={location.pathname === '/users'}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Users')} />
                </ListItemButton>
              </Link>
            )}

            {isAdmin && (
              <Link to="/hospitals">
                <ListItemButton selected={location.pathname === '/hospitals'}>
                  <ListItemIcon>
                    <CottageIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Hospitals')} />
                </ListItemButton>
              </Link>
            )}

            {isAdmin && (
              <Link to="/departments">
                <ListItemButton selected={location.pathname === '/departments'}>
                  <ListItemIcon>
                    <FolderOpenIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Departments')} />
                </ListItemButton>
              </Link>
            )}

            {isAdmin && (
              <Link to="/labels">
                <ListItemButton selected={location.pathname === '/labels'}>
                  <ListItemIcon>
                    <LabelIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Labels')} />
                </ListItemButton>
              </Link>
            )}

            {isAdmin && (
              <Link to="/companies">
                <ListItemButton selected={location.pathname === '/companies'}>
                  <ListItemIcon>
                    <ApartmentIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Companies')} />
                </ListItemButton>
              </Link>
            )}

            <Divider sx={{ my: 1 }} />
            {isAdmin && (
              <Link to="/rates">
                <ListItemButton selected={location.pathname === '/rates'}>
                  <ListItemIcon>
                    <StarOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Rates')} />
                </ListItemButton>
              </Link>
            )}

            <Link to="/rooms">
              <ListItemButton selected={location.pathname.startsWith('/rooms')}>
                <ListItemIcon>
                  <BedroomChildOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={t('Rooms')} />
              </ListItemButton>
            </Link>
            <Link to="/booking">
              <ListItemButton
                selected={location.pathname.startsWith('/booking')}
              >
                <ListItemIcon>
                  <EventAvailableRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={t('Booking')} />
              </ListItemButton>
            </Link>
            {isAdmin && (
              <>
                <Divider sx={{ my: 1 }} />
                <Link to="/application">
                  <ListItemButton
                    selected={location.pathname === '/application'}
                  >
                    <ListItemIcon>
                      <LayersIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('Application')} />
                  </ListItemButton>
                </Link>
              </>
            )}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {widthMax700 && <Toolbar />}
          {/* <Box sx={widthMax950 ? { m: 2 } : { mr: 5, ml: 5, mt: 4, mb: 4 }}> */}
          <Box sx={{ m: 2 }}>
            {children}
            {!location.pathname.startsWith('/booking') && (
              <Box sx={{ mt: 4 }}>
                <ApplicationFooter />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Dashboard
