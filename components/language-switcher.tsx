'use client'
import { LANGUAGES } from '@/constants/i18n'
import { cn } from '@/lib/utils'
import { usePathname } from '@/navigation'
import { Languages } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { useSearchParams } from 'next/navigation'

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleLanguageChange = (code: string) => {
    location.href = `/${code}${pathname}?${searchParams.toString()}`
    // Not working with next-intl
    // router.push(pathname, { locale: code })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'}>
          <Languages className='size-4 mr-2' />
          {LANGUAGES[locale as keyof typeof LANGUAGES]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={cn(locale === code && 'font-bold')}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
