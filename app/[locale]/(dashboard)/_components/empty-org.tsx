import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { AppConfig } from '@/configs/app-config'
import { CreateOrganization } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export const EmptyOrg = () => {
  const t = useTranslations('Dashboard')

  return (
    <div className='h-full flex flex-col items-center justify-center'>
      <Image src={'/elements.svg'} alt={t('noOrganizationAlt')} width={200} height={200} />
      <h2 className='text-2xl font-semibold mt-6'>
        {t('welcomeTitle', {
          appName: AppConfig.appName
        })}
      </h2>
      <p className='text-muted-foreground text-sm mt-2'>{t('welcomeDescription')}</p>
      <div className='mt-6'>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={'lg'}>{t('createOrganizationButton')}</Button>
          </DialogTrigger>
          <DialogContent className='p-0 border-none bg-transparent max-w-[480px]'>
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
