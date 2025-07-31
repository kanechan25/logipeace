'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface RelativeTimeProps {
  dateString: string
  fallbackFormat?: string
}

export function RelativeTime({ dateString, fallbackFormat = 'MMM D, YYYY' }: RelativeTimeProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <span>{dayjs(dateString).format(fallbackFormat)}</span>
  }

  return <span title={dayjs(dateString).format('YYYY-MM-DD HH:mm')}>{dayjs(dateString).fromNow()}</span>
}
