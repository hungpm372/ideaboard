'use client'

import { Check, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Hint } from './hint'
import { useTranslations } from 'next-intl'

export function ModeToggle() {
  const t = useTranslations('Theme')
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='aspect-square mt-auto'>
          <Hint label={'Change theme'} side='right' align='start' sideOffset={10}>
            <button
              className={cn(
                'size-full rounded-md flex items-center justify-center transition-all duration-300',
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
              )}
            >
              <Sun className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            </button>
          </Hint>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='right'>
        <DropdownMenuItem
          className='flex items-center justify-between'
          onClick={() => setTheme('light')}
        >
          {t('light')}
          {theme === 'light' && <Check className='size-4' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center justify-between'
          onClick={() => setTheme('dark')}
        >
          {t('dark')}
          {theme === 'dark' && <Check className='size-4' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center justify-between'
          onClick={() => setTheme('system')}
        >
          {t('system')}
          {theme === 'system' && <Check className='size-4' />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
