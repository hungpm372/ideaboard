import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { LOCALES } from '@/constants/i18n'

export const locales = LOCALES
export const localePrefix = 'always'

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix
})
