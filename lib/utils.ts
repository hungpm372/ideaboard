import { Camera, Color, Point, Side, XYWH } from '@/types/canvas'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777']

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length]
}

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y
  }
}

export function colorToCss(color: Color): string {
  return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = { ...bounds }

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(bounds.x + bounds.width, point.x)
    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }

  if ((corner & Side.Right) === Side.Right) {
    result.width = Math.abs(point.x - bounds.x)
    result.x = Math.min(bounds.x, point.x)
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(bounds.y + bounds.height, point.y)
    result.height = Math.abs(bounds.y + bounds.height - point.y)
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.height = Math.abs(point.y - bounds.y)
    result.y = Math.min(bounds.y, point.y)
  }

  return result
}
