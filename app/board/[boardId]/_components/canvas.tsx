'use client'

import { pointerEventToCanvasPoint } from '@/lib/utils'
import { useCanRedo, useCanUndo, useHistory, useMutation } from '@/liveblocks.config'
import { Camera, CanvasMode, CanvasState } from '@/types/canvas'
import { useCallback, useState } from 'react'
import { CursorsPresence } from './cursors-presence'
import { Info } from './info'
import { Participants } from './participants'
import { Toolbar } from './toolbar'

interface CanvasProps {
  boardId: string
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None })
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })

  const history = useHistory()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((prev) => ({
      x: prev.x + e.deltaX,
      y: prev.y + e.deltaY
    }))
  }, [])

  const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault()

    const current = pointerEventToCanvasPoint(e, camera)
    setMyPresence({
      cursor: current
    })
  }, [])

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({
      cursor: null
    })
  }, [])

  return (
    <main className='size-full relative bg-neutral-100 touch-none'>
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <svg
        className='h-screen w-screen bg-green-400'
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g>
          <CursorsPresence />
        </g>
      </svg>
    </main>
  )
}
