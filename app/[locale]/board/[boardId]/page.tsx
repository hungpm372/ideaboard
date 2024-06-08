import { Room } from '@/components/room'
import { Canvas } from './_components/canvas'
import { Loading } from './_components/loading'

interface BoardIdPageProps {
  params: {
    boardId: string
  }
}

const BoardIdPage = ({ params: { boardId } }: BoardIdPageProps) => {
  return (
    <Room roomId={boardId} fallback={<Loading />}>
      <Canvas boardId={boardId} />
    </Room>
  )
}

export default BoardIdPage
