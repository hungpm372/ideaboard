'use client'

import { useOrganizationList } from '@clerk/nextjs'
import { Item } from './item'

export const List = () => {
  const { userMemberships } = useOrganizationList({ userMemberships: { infinite: true } })

  if (!userMemberships.data?.length) return null

  return (
    <ul className='space-y-4'>
      {userMemberships.data.map(({ organization }) => (
        <Item
          key={organization.id}
          id={organization.id}
          name={organization.name}
          imageUrl={organization.imageUrl}
        />
      ))}
    </ul>
  )
}
