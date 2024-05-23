import { useSelf, useStorage } from '@/liveblocks.config'
import { Layer, XYWH } from '@/types/canvas'
import { shallow } from '@liveblocks/react'

const boundingBox = (layers: Layer[]): XYWH | null => {
  if (layers.length === 0) {
    return null
  }

  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (const layer of layers) {
    left = Math.min(left, layer.x)
    top = Math.min(top, layer.y)
    right = Math.max(right, layer.x + layer.width)
    bottom = Math.max(bottom, layer.y + layer.height)
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  }
}

export const useSelectionBounds = () => {
  const selection = useSelf((me) => me.presence.selection)
  return useStorage((root) => {
    const selectedLayers = selection.map((layerId) => root.layers.get(layerId)!).filter(Boolean)

    return boundingBox(selectedLayers)
  }, shallow)
}
