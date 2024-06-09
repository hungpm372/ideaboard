'use client'

import { Actions } from '@/components/actions'
import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { AppConfig } from '@/configs/app-config'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useRenameModal } from '@/store/use-rename-modal'
import { useQuery } from 'convex/react'
import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

interface InfoProps {
  boardId: string
}

const font = Poppins({ subsets: ['latin'], weight: ['600'] })

export const Info = ({ boardId }: InfoProps) => {
  const t = useTranslations('Board')
  const { onOpen } = useRenameModal()
  const data = useQuery(api.board.get, { id: boardId as Id<'boards'> })

  if (!data) return <InfoSkeleton />

  return (
    <div className='absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md'>
      <Hint label={t('goToBoardsTooltip')} side='bottom' sideOffset={10}>
        <Button asChild className='px-2' variant={'board'}>
          <Link href={'/'}>
            <Image src={'/logo.svg'} alt={AppConfig.appName} width={40} height={40} />
            <span className={cn('font-semibold text-xl ml-2 text-black', font.className)}>
              {AppConfig.appName}
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label={t('renameBoardTooltip')} side='bottom' sideOffset={10}>
        <Button
          variant={'board'}
          className='text-base font-normal px-2'
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions id={data._id} title={data.title} side='bottom' sideOffset={10}>
        <div>
          <Hint label={t('mainMenuTooltip')} side='bottom' sideOffset={10}>
            <Button variant={'board'} size={'icon'}>
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  )
}

export const InfoSkeleton = () => {
  return (
    <div className='absolute top-2 left-2 bg-white rounded-md h-12 flex items-center shadow-md w-[300px]'></div>
  )
}

const TabSeparator = () => {
  return <div className='text-neutral-300 px-1.5'>|</div>
}
