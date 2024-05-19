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

interface ActionsProps {
  children: React.ReactNode
  side?: DropdownMenuContentProps['side']
  sideOffset?: DropdownMenuContentProps['sideOffset']
  id: string
  title: string
}

export const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {
  const { onOpen } = useRenameModal()
  const { mutate, pending } = useApiMutation(api.board.remove)

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => {
        toast.success('Link copied to clipboard')
      })
      .catch(() => {
        toast.error('Failed to copy link')
      })
  }

  const onDelete = () => {
    mutate({ id })
      .then(() => {
        toast.success('Board deleted')
      })
      .catch(() => {
        toast.error('Failed to delete board')
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
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpen(id, title)} className='p-3 cursor-pointer'>
          <Pencil className='size-4 mr-2' />
          Rename
        </DropdownMenuItem>
        <ConfirmModal
          header='Delete board'
          description='Are you sure you want to delete this board? This action cannot be undone.'
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant={'ghost'}
            className='p-3 cursor-pointer text-sm w-full justify-start font-normal'
          >
            <Trash2 className='size-4 mr-2' />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
