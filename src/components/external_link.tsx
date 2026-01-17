import { Link } from '@mui/material'
import { useEffect, useState } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { grey } from '@mui/material/colors'

interface ExternalLinkInfo {
  link: string
  description: string
}

interface AuthInfo {
  access_token: string
  refresh_token: string
}

export const ExternalLink = () => {
  const [info, setInfo] = useState<ExternalLinkInfo>()

  const [auth, setAuth] = useState<AuthInfo>({
    access_token: '',
    refresh_token: '',
  })

  useEffect(() => {
    fetch('/link_config.json')
      .then((res) => res.json())
      .then((data) => setInfo(data))
  }, [])

  const handleListenAuthState = () => {
    const cookies = document.cookie;
    const accessToken = cookies.match(/accessToken=([^;]+)/);
    const refreshToken = cookies.match(/refreshToken=([^;]+)/);
    if (!accessToken || !refreshToken) {
      setAuth(
        {
          access_token: '',
          refresh_token: '',
        }
      )
    } else {
      const aTokenString = accessToken[1];
      const rTokenString = refreshToken[1];
      setAuth(
        {
          access_token: aTokenString,
          refresh_token: rTokenString,
        }
      )
    }
  }

  useEffect(() => {
    window.addEventListener('auth_info_changed', handleListenAuthState)

    const cookies = document.cookie;
    const accessToken = cookies.match(/accessToken=([^;]+)/);
    const refreshToken = cookies.match(/refreshToken=([^;]+)/);
    if (!accessToken || !refreshToken) {
      setAuth(
        {
          access_token: '',
          refresh_token: '',
        }
      )
    } else {
      const aTokenString = accessToken[1];
      const rTokenString = refreshToken[1];
      setAuth(
        {
          access_token: aTokenString,
          refresh_token: rTokenString,
        }
      )
    }

    return () => {
      window.removeEventListener('auth_info_changed', handleListenAuthState)
    }
  }, [])

  const color = grey[900]

  return (
    <span>
      <Link
        href={`${info?.link}?access_token=${auth.access_token}&refresh_token=${auth.refresh_token}`}
        rel="noreferrer"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          color,
        }}
        variant="subtitle2"
        underline="none"
      >
        {info?.description}
        <OpenInNewIcon />
      </Link>
    </span>
  )
}
