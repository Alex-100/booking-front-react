import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface ErrorCardProps {
  message: string
}

const theme = createTheme()

export const ErrorCard: FC<ErrorCardProps> = ({ message }) => {
  const { t } = useTranslation()
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          component={'div'}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            bgcolor: 'error.main',
            color: 'white',
            gap: '1rem',
            borderRadius: '1rem',
          }}
        >
          <Box component={'div'} sx={{ fontSize: '2rem' }}>
            {t('Error')}
          </Box>
          <div>{message}</div>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

// (
//   <div className="w-screen h-screen flex justify-center items-center">
//     <div className="flex flex-col gap-4 w-96 p-4 border rounded-lg border-error">
//       <span className="text-error font-bold text-4xl uppercase text-center">Ошибка</span>
//       <span className="text-error font-semibold text-lg whitespace-pre-wrap">
//         {message}
//       </span>
//     </div>
//   </div>
// );

/**
 * 
 * 
 * return (
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
 */
