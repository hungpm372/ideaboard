'use client'

import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu'
import { Link2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { api } from '@/convex/_generated/api'
import { ConfirmModal } from './confirm-modal'
import { Button } from './ui/button'
import { useRenameModal } from '@/store/use-rename-modal'
import { useTranslations } from 'next-intl'

interface ActionsProps {
  children: React.ReactNode
  side?: DropdownMenuContentProps['side']
  sideOffset?: DropdownMenuContentProps['sideOffset']
  id: string
  title: string
}

export const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {
  const { onOpen } = useRenameModal()
  const t = useTranslations('BoardActions')
  const { mutate, pending } = useApiMutation(api.board.remove)

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => {
        toast.success(t('copyLinkSuccess'))
      })
      .catch(() => {
        toast.error(t('copyLinkFailure'))
      })
  }

  const onDelete = () => {
    mutate({ id })
      .then(() => {
        toast.success(t('deleteBoardSuccess'))
      })
      .catch(() => {
        toast.error(t('deleteBoardFailure'))
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className='w-60'
      >
        <DropdownMenuItem onClick={onCopyLink} className='p-3 cursor-pointer'>
          <Link2 className='size-4 mr-2' />
          {t('copyBoardLink')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpen(id, title)} className='p-3 cursor-pointer'>
          <Pencil className='size-4 mr-2' />
          {t('renameBoard')}
        </DropdownMenuItem>
        <ConfirmModal
          header={t('deleteBoardHeader')}
          description={t('deleteBoardDescription')}
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant={'ghost'}
            className='p-3 cursor-pointer text-sm w-full justify-start font-normal'
          >
            <Trash2 className='size-4 mr-2' />
            {t('deleteBoard')}
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
