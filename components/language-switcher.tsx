'use client'
import { LANGUAGES } from '@/constants/i18n'
import { cn } from '@/lib/utils'
import { usePathname } from '@/navigation'
import { Check, ChevronDown, Languages } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleLanguageChange = (code: string) => {
    if (code === locale) return

    location.href = `/${code}${pathname}?${searchParams.toString()}`
    // Not working with next-intl
    // router.push(pathname, { locale: code })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'}>
          <Languages className='size-4 mr-2' />
          {LANGUAGES[locale as keyof typeof LANGUAGES][locale as keyof typeof LANGUAGES]}
          <ChevronDown className='size-4 ml-8' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start' className={'w-full'}>
        {Object.entries(LANGUAGES[locale as keyof typeof LANGUAGES]).map(([code, name]) => {
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={cn(locale === code && 'font-bold flex items-center justify-between')}
            >
              {name}
              {locale === code && <Check className='size-4' />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
