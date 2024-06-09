import { cn, colorToCss } from '@/lib/utils'
import { useMutation } from '@/liveblocks.config'
import { TextLayer } from '@/types/canvas'
import { useTranslations } from 'next-intl'
import { Kalam } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

const font = Kalam({
  subsets: ['latin'],
  weight: ['400']
})

const caculateTextSize = (width: number, height: number) => {
  const maxFontSize = 100
  const scaleFactor = 0.2
  const fontSizeBasedOnWidth = width * scaleFactor
  const fontSizeBasedOnHeight = height * scaleFactor
  return Math.min(maxFontSize, fontSizeBasedOnWidth, fontSizeBasedOnHeight)
}

interface TextProps {
  id: string
  layer: TextLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectionColor?: string
}

export const Text = ({ id, layer, onPointerDown, selectionColor }: TextProps) => {
  const t = useTranslations('Board')
  const { x, y, width, height, fill, value } = layer

  const updateText = useMutation(({ storage }, newText: string) => {
    const liveLayers = storage.get('layers')
    liveLayers.get(id)?.set('value', newText)
  }, [])

  const handleTextChange = (e: ContentEditableEvent) => {
    updateText(e.target.value)
  }

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : 'none'
      }}
    >
      <ContentEditable
        html={value || t('textPlaceholder')}
        onChange={handleTextChange}
        className={cn(
          'size-full flex items-center justify-center drop-shadow-md text-center outline-none',
          font.className
        )}
        style={{
          color: fill ? colorToCss(fill) : '#000',
          fontSize: caculateTextSize(width, height)
        }}
      />
    </foreignObject>
  )
}
