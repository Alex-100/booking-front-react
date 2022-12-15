import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import SignInForm from './SignInForm'
import { SignInFields } from './types'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/lab/AlertTitle'
import { useTranslation } from 'react-i18next'

const theme = createTheme()

export default function SignInPage() {
  const history = useHistory()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  const { t } = useTranslation()

  const handleSubmitForm = (values: SignInFields) => {
    setLoading(true)
    setError(false)
    axios
      .post(`/login`, values)
      .then((response) => {
        localStorage.setItem('auth', JSON.stringify(response.data))
        history.push('/statistic/common')
        setLoading(false)
      })
      .catch(() => {
        setError(true)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mt={2} mb={3}>
            {t('Sign in')}
          </Typography>
          {error && (
            <Box mb={3} width="100%">
              <Alert severity="error">
                <AlertTitle>{t('Error')}</AlertTitle>
                {t('Invalid Username or Password')}
              </Alert>
            </Box>
          )}
          <SignInForm onSubmit={handleSubmitForm} loading={loading && !error} />
        </Box>
      </Container>
    </ThemeProvider>
  )
}
