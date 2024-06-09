'use client'

import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useRenameModal } from '@/store/use-rename-modal'
import { FormEventHandler, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export const RenameModal = () => {
  const t = useTranslations('BoardActions')
  const { mutate, pending } = useApiMutation(api.board.update)
  const { isOpen, initialValues, onClose } = useRenameModal()
  const [title, setTitle] = useState<string>(initialValues.title)

  useEffect(() => {
    setTitle(initialValues.title)
  }, [initialValues.title])

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    mutate({ id: initialValues.id, title })
      .then(() => {
        toast.success(t('renameBoardSuccess'))
        onClose()
      })
      .catch(() => {
        toast.error(t('renameBoardFailure'))
        onClose()
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('renameBoardHeader')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('renameBoardDescription')}</DialogDescription>
        <form onSubmit={onSubmit} className='space-y-4'>
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('renameBoardPlaceholder')}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant={'outline'}>
                {t('cancelButton')}
              </Button>
            </DialogClose>
            <Button disabled={pending} type='submit'>
              {t('saveButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
