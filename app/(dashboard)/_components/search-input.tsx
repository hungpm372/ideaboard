'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import queryString from 'query-string'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

export const SearchInput = () => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [debouncedValue, updateDebouncedValue] = useDebounceValue(value, 500)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: '/',
        query: { search: debouncedValue }
      },
      { skipEmptyString: true, skipNull: true }
    )

    router.push(url)
  }, [debouncedValue, router])

  return (
    <div className='w-full relative'>
      <Search className='absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground size-4' />
      <Input
        className='w-full max-w-[516px] pl-9'
        placeholder='Search for anything...'
        onChange={handleChange}
        value={value}
      />
    </div>
  )
}
