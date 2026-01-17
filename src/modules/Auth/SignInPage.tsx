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
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

const theme = createTheme()

export default function SignInPage() {
  interface ExternalLinkInfo {
    link: string
    description: string
  }

  const [info, setInfo] = React.useState<ExternalLinkInfo>()
  const history = useHistory()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [systemType, setSystemType] = React.useState<'booking' | 'med-risk'>('booking');

  const { t } = useTranslation()

  React.useEffect(() => {
    fetch('/link_config.json')
      .then((res) => res.json())
      .then((data) => setInfo(data))
  }, [])

  const handleSystemChange = (event: SelectChangeEvent<'booking' | 'med-risk'>) => {
    setSystemType(event.target.value as 'booking' | 'med-risk');
  };

  const handleSubmitForm = (values: SignInFields) => {
    console.log(values)
    setLoading(true)
    setError(false)
    axios
      .post(`/login`, values)
      .then((response) => {
        const jwtToken = response.data;
        document.cookie = `accessToken=${jwtToken.access_token}`
        document.cookie = `refreshToken=${jwtToken.refresh_token}`
        document.cookie = `username=${values.username}`
        
        if (systemType === 'booking') {
          history.push('/statistic/common');
        } else if (systemType === 'med-risk' && info?.link) {
          window.open(info.link, '_self');
        }

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
          <Box mt={3} width="100%">
            <FormControl fullWidth>
              <InputLabel id="system-select-label">{t('System')}</InputLabel>
              <Select
                labelId="system-select-label"
                value={systemType}
                label={t('System')}
                onChange={(value) => handleSystemChange(value)}
              >
                <MenuItem value="booking">Booking</MenuItem>
                <MenuItem value="med-risk">Med-risk</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
