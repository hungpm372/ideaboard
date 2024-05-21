'use client'

import { useOthers, useSelf } from '@/liveblocks.config'
import { UserAvatar } from './user-avatar'
import { connectionIdToColor } from '@/lib/utils'

const MAX_SHOWN_USERS = 5

export const Participants = () => {
  const users = useOthers()
  const currentUser = useSelf()
  const hasMoreUsers = users.length > MAX_SHOWN_USERS
  return (
    <div className='absolute top-2 right-2 bg-white rounded-md p-3 h-12 flex items-center shadow-md'>
      <div className='flex gap-x-2'>
        {users.slice(0, MAX_SHOWN_USERS).map((user) => (
          <UserAvatar
            key={user.connectionId}
            src={user.info?.picture}
            name={user.info?.name}
            fallback={user.info?.name?.charAt(0).toUpperCase() || 'T'}
            borderColor={connectionIdToColor(user.connectionId)}
          />
        ))}
        {currentUser && (
          <UserAvatar
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.charAt(0).toUpperCase() || 'T'}
            borderColor={connectionIdToColor(currentUser.connectionId)}
          />
        )}
        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  )
}

export const ParticipantsSkeleton = () => {
  return (
    <div className='absolute top-2 right-2 bg-white rounded-md p-3 h-12 flex items-center shadow-md w-[100px]'></div>
  )
}
