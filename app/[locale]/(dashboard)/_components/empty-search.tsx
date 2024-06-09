import { useTranslations } from 'next-intl'
import Image from 'next/image'

export const EmptySearch = () => {
  const t = useTranslations('Dashboard')

  return (
    <div className='h-full flex flex-col items-center justify-center'>
      <Image src={'/empty-search.svg'} alt={t('emptySearchAlt')} width={140} height={140} />
      <h2 className='text-2xl font-semibold mt-6'>{t('emptySearchTitle')}</h2>
      <p className='text-muted-foreground text-sm mt-2'>{t('emptySearchDescription')}</p>
    </div>
  )
}
