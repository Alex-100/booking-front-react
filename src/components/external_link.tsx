import { Link } from '@mui/material'
import { useEffect, useState } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface ExternalLinkInfo {
  link: string
  description: string
}

export const ExternalLink = () => {
  const [info, setInfo] = useState<ExternalLinkInfo>()

  useEffect(() => {
    fetch('/link_config.json')
      .then((res) => res.json())
      .then((data) => setInfo(data))
  }, [])

  return (
    <span>
      <Link
        href={info?.link}
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
