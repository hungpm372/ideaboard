import Image from 'next/image'

export const EmptyFavorites = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center'>
      <Image src={'/empty-favorites.svg'} alt='No favorite results' width={140} height={140} />
      <h2 className='text-2xl font-semibold mt-6'>You have no favorite boards!</h2>
      <p className='text-muted-foreground text-sm mt-2'>
        Add boards to your favorites to quickly access them
      </p>
    </div>
  )
}
