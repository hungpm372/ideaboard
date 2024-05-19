'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Overlay } from './overlay'
import { useAuth } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { Footer } from './footer'
import { Skeleton } from '@/components/ui/skeleton'
import { Actions } from '@/components/actions'
import { MoreHorizontal } from 'lucide-react'

interface BoardCardProps {
  id: string
  title: string
  imageUrl: string
  authorId: string
  authorName: string
  createdAt: number
  orgId: string
  isFavorite: boolean
}

export const BoardCard = ({
  authorId,
  authorName,
  createdAt,
  id,
  imageUrl,
  isFavorite,
  orgId,
  title
}: BoardCardProps) => {
  const { userId } = useAuth()
  const authorLabel = userId === authorId ? 'You' : authorName
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <Link href={`/board/${id}`}>
      <div className='group aspect-[100/127] border rounded-lg flex flex-col justify-center overflow-hidden'>
        <div className='relative flex-1 bg-amber-50'>
          <Image src={imageUrl} alt={title} fill className='object-cover' />
          <Overlay />
          <Actions id={id} title={title} side='right'>
            <button className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none'>
              <MoreHorizontal className='text-white opacity-75 hover:opacity-100 transition-opacity' />
            </button>
          </Actions>
        </div>
        <Footer
          isFavorite={isFavorite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          disabled={false}
          onClick={() => {}}
        />
      </div>
    </Link>
  )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className='aspect-[100/127] rounded-lg overflow-hidden'>
      <Skeleton className='size-full' />
    </div>
  )
}
