'use client'

import { Hint } from '@/components/hint'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { CreateOrganization } from '@clerk/nextjs'
import { Plus } from 'lucide-react'

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='aspect-square'>
          <Hint label='Create organization' side='right' align='start' sideOffset={10}>
            <button className='bg-white/25 size-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition'>
              <Plus className='text-white' />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className='p-0 bg-transparent border-none max-w-[480px]'>
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  )
}
