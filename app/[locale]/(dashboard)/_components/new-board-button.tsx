'use client'

import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface NewBoardButtonProps {
  orgId: string
  disabled?: boolean
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const router = useRouter()
  const t = useTranslations('Dashboard')
  const { mutate, pending } = useApiMutation(api.board.create)

  const onClick = () => {
    mutate({
      orgId,
      title: t('untitledBoard')
    })
      .then((id) => {
        toast.success(t('createBoardSuccess'))
        router.push(`/board/${id}`)
      })
      .catch(() => {
        toast.error(t('createBoardFailure'))
      })
  }

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        'col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6',
        (pending || disabled) && 'cursor-not-allowed opacity-75 hover:bg-blue-600'
      )}
    >
      <div />
      <Plus className='size-12 text-white stroke-1' />
      <p className='text-sm text-white font-light'>{t('newBoardButton')}</p>
    </button>
  )
}
