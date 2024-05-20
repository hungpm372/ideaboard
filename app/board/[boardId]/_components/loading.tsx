import { Loader } from 'lucide-react'
import { Info } from './info'
import { Participants } from './participants'
import { Toolbar } from './toolbar'

export const Loading = () => {
  return (
    <main className='size-full relative bg-neutral-100 touch-none flex items-center justify-center'>
      <Loader className='size-6 text-muted-foreground animate-spin' />
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  )
}
