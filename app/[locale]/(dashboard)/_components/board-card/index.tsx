'use client'

import { Actions } from '@/components/actions'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { getLocale } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Footer } from './footer'
import { Overlay } from './overlay'

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
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const authorLabel = userId === authorId ? t('authorLabelYou') : authorName
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: getLocale(locale)
  })

  const { mutate: onFavorite, pending: favoritePending } = useApiMutation(api.board.favorite)
  const { mutate: onUnfavorite, pending: unfavoritePending } = useApiMutation(api.board.unfavorite)

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id }).catch(() => {
        toast.error(t('failedToUnfavorite'))
      })
    } else {
      onFavorite({ id, orgId }).catch(() => {
        toast.error(t('failedToFavorite'))
      })
    }
  }

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
          disabled={favoritePending || unfavoritePending}
          onClick={toggleFavorite}
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
