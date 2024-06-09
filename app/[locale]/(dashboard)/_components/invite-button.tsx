import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { OrganizationProfile } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const InviteButton = () => {
  const t = useTranslations('Dashboard')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <Plus className='size-4 mr-2' />
          {t('inviteMembersButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className='p-0 bg-transparent border-none max-w-[880px]'>
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  )
}
