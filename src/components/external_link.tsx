import { Link } from '@mui/material'
import { useEffect, useState } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

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
    const s = localStorage.getItem('auth')
    setAuth(
      s
        ? (JSON.parse(s) as AuthInfo)
        : {
            access_token: '',
            refresh_token: '',
          }
    )
  }

  useEffect(() => {
    window.addEventListener('auth_info_changed', handleListenAuthState)

    const s = localStorage.getItem('auth')
    setAuth(
      s
        ? (JSON.parse(s) as AuthInfo)
        : {
            access_token: '',
            refresh_token: '',
          }
    )

    return () => {
      window.removeEventListener('auth_info_changed', handleListenAuthState)
    }
  }, [])

  return (
    <span>
      <Link
        href={`${info?.link}?access_token=${auth.access_token}&refresh_token=${auth.refresh_token}`}
        target="_blank"
        rel="noreferrer"
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        {info?.description}
        <OpenInNewIcon />
      </Link>
    </span>
  )
}
