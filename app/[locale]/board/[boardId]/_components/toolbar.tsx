import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from 'lucide-react'
import { ToolButton } from './tool-button'
import { CanvasMode, CanvasState, LayerType } from '@/types/canvas'
import { useTranslations } from 'next-intl'

interface ToolbarProps {
  canvasState: CanvasState
  setCanvasState: (state: CanvasState) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo
}: ToolbarProps) => {
  const t = useTranslations('Board')

  return (
    <div className='absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4'>
      <div className='bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md'>
        <ToolButton
          label={t('selectTooltip')}
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label={t('textTooltip')}
          icon={Type}
          onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Text })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text
          }
        />
        <ToolButton
          label={t('stickyNoteTooltip')}
          icon={StickyNote}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note
          }
        />
        <ToolButton
          label={t('rectangleTooltip')}
          icon={Square}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />
        <ToolButton
          label={t('ellipseTooltip')}
          icon={Circle}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          label={t('penTooltip')}
          icon={Pencil}
          onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          isActive={canvasState.mode === CanvasMode.Pencil}
        />
      </div>
      <div className='bg-white rounded-md p-1.5 flex flex-col items-center shadow-md'>
        <ToolButton label={t('undoTooltip')} icon={Undo2} onClick={undo} isDisabled={!canUndo} />
        <ToolButton label={t('redoTooltip')} icon={Redo2} onClick={redo} isDisabled={!canRedo} />
      </div>
    </div>
  )
}

export const ToolbarSkeleton = () => {
  return (
    <div className='bg-white absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 h-[360px] w-[52px] shadow-md rounded-md'></div>
  )
}
