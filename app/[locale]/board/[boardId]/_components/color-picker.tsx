'use client'

import { colorToCss } from '@/lib/utils'
import { Color } from '@/types/canvas'

interface ColorPickerProps {
  onChange: (color: Color) => void
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className='flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200'>
      <ColorButton color={{ r: 243, g: 82, b: 35 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 249, b: 177 }} onClick={onChange} />
      <ColorButton color={{ r: 44, g: 180, b: 48 }} onClick={onChange} />
      <ColorButton color={{ r: 208, g: 149, b: 64 }} onClick={onChange} />
      <ColorButton color={{ r: 107, g: 98, b: 198 }} onClick={onChange} />
      <ColorButton color={{ r: 39, g: 109, b: 195 }} onClick={onChange} />
      <ColorButton color={{ r: 192, g: 68, b: 143 }} onClick={onChange} />
      <ColorButton color={{ r: 234, g: 230, b: 117 }} onClick={onChange} />
      <ColorButton color={{ r: 249, g: 162, b: 90 }} onClick={onChange} />
      <ColorButton color={{ r: 82, g: 149, b: 235 }} onClick={onChange} />
      <ColorButton color={{ r: 127, g: 201, b: 92 }} onClick={onChange} />
      <ColorButton color={{ r: 236, g: 153, b: 180 }} onClick={onChange} />
      <ColorButton color={{ r: 100, g: 125, b: 237 }} onClick={onChange} />
      <ColorButton color={{ r: 237, g: 197, b: 63 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />
    </div>
  )
}

interface ColorButtonProps {
  color: Color
  onClick: (color: Color) => void
}

const ColorButton = ({ color, onClick }: ColorButtonProps) => {
  return (
    <button
      className='size-8 flex items-center justify-center hover:opacity-75 transition'
      onClick={() => onClick(color)}
    >
      <div
        className='size-full rounded-md border border-neutral-300'
        style={{
          backgroundColor: colorToCss(color)
        }}
      />
    </button>
  )
}
