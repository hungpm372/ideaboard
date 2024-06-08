import { Loader } from 'lucide-react'
import { InfoSkeleton } from './info'
import { ParticipantsSkeleton } from './participants'
import { ToolbarSkeleton } from './toolbar'

export const Loading = () => {
  return (
    <main className='size-full relative bg-neutral-100 touch-none flex items-center justify-center'>
      <Loader className='size-6 text-muted-foreground animate-spin' />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  )
}
