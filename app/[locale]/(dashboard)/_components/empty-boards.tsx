'use client'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useOrganization } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const EmptyBoards = () => {
  const router = useRouter()
  const t = useTranslations('Dashboard')
  const { organization } = useOrganization()
  const { mutate, pending } = useApiMutation(api.board.create)

  const onClick = () => {
    if (!organization) return

    mutate({
      orgId: organization.id,
      title: t('untitledBoard')
    })
      .then((id) => {
        toast.success(t('createBoardSuccess'))
        router.push(`/board/${id}`)
      })
      .catch((err) => {
        toast.error(t('createBoardFailure'))
      })
  }

  return (
    <div className='h-full flex flex-col items-center justify-center'>
      <Image src={'/note.svg'} alt={t('noBoardAlt')} width={110} height={110} />
      <h2 className='text-2xl font-semibold mt-6'>{t('createFirstBoardTitle')}</h2>
      <p className='text-muted-foreground text-sm mt-2'>{t('createFirstBoardDescription')}</p>
      <div className='mt-6'>
        <Button disabled={pending} onClick={onClick} size={'lg'}>
          {t('createBoardButton')}
        </Button>
      </div>
    </div>
  )
}
