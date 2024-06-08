'use client'
import { LANGUAGES } from '@/constants/i18n'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from '@/navigation'
import { Languages } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (code: string) => {
    location.href = `/${code}${pathname}`
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
