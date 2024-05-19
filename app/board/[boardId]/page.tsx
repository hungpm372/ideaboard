import { Canvas } from './_components/canvas'

interface BoardIdPageProps {
  params: {
    boardId: string
  }
}

const BoardIdPage = ({ params: { boardId } }: BoardIdPageProps) => {
  return <Canvas boardId={boardId} />
}

export default BoardIdPage
