import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  className?: string
}

const ChatterLogo: React.FC<Props> = ({ className }) => {
  return (
    <h2 className={cn("font-bold text-[1.75rem] text-primary font-display tracking-[-2px] ", className)}>
      <Link href="/">Chatter</Link>
    </h2>
  )
}

export default ChatterLogo