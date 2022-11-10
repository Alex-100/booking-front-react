import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import axios from 'axios'
import store from './store'
import 'reseter.css'
import './index.css'

// import App from './App'
// import { API_URL } from './constants'

import './i18n'
import 'moment/locale/ru'
import 'moment/locale/en-gb'
import { Box, CircularProgress } from '@mui/material'

const App = React.lazy(() => import('./App'))

axios.defaults.baseURL = '/api'

const LoadingSplash = () => (
  <Box
    sx={{
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
    }}
  >
    <>
      <CircularProgress sx={{ m: 4 }} />
    </>
  </Box>
)

ReactDOM.render(
  // @ts-ignore
  <Provider store={store}>
    {/* @ts-ignore */}
    <SnackbarProvider maxSnack={3}>
      <Suspense fallback={<LoadingSplash />}>
        <App />
      </Suspense>
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
)
