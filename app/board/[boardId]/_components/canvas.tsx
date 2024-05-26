'use client'

import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from '@/lib/utils'
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage
} from '@/liveblocks.config'
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH
} from '@/types/canvas'
import { LiveObject } from '@liveblocks/client'
import { nanoid } from 'nanoid'
import { useCallback, useMemo, useState } from 'react'
import { CursorsPresence } from './cursors-presence'
import { Info } from './info'
import { LayerPreview } from './layer-preview'
import { Participants } from './participants'
import { Toolbar } from './toolbar'
import { SelectionBox } from './selection-box'
import { SelectionTools } from './selection-tools'

const MAX_LAYERS = 100

interface CanvasProps {
  boardId: string
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds)

  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None })
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0
  })

  const history = useHistory()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text | LayerType.Note,
      position: Point
    ) => {
      const liveLayers = storage.get('layers')

      if (liveLayers.size >= MAX_LAYERS) return

      const liveLayerIds = storage.get('layerIds')
      const layerId = nanoid()
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        width: 100,
        height: 100,
        fill: lastUsedColor
      })

      liveLayerIds.push(layerId)
      liveLayers.set(layerId, layer)

      setMyPresence({ selection: [layerId] }, { addToHistory: true })

      setCanvasState({
        mode: CanvasMode.None
      })
    },
    [lastUsedColor]
  )

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y
      }

      const liveLayers = storage.get('layers')

      for (const layerId of self.presence.selection) {
        const layer = liveLayers.get(layerId)

        if (!layer) continue

        layer.update({
          x: layer.get('x') + offset.x,
          y: layer.get('y') + offset.y
        })
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point
      })
    },
    [canvasState]
  )

  const unselectLayers = useMutation(({ setMyPresence, self }) => {
    if (self.presence.selection.length === 0) return

    setMyPresence(
      {
        selection: []
      },
      { addToHistory: true }
    )
  }, [])

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return

      const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point)

      const liveLayers = storage.get('layers')
      const layer = liveLayers.get(self.presence.selection[0])

      if (!layer) return

      layer.update(bounds)
    },
    [canvasState]
  )

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause()

      setCanvasState({
        mode: CanvasMode.Resizing,
        corner,
        initialBounds
      })
    },
    [history]
  )

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((prev) => ({
      x: prev.x + e.deltaX,
      y: prev.y + e.deltaY
    }))
  }, [])

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault()

      const current = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current)
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current)
      }

      setMyPresence({
        cursor: current
      })
    },
    [canvasState, resizeSelectedLayer, camera, translateSelectedLayers]
  )

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({
      cursor: null
    })
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Inserting) return

      setCanvasState({
        mode: CanvasMode.Pressing,
        origin: point
      })
    },
    [camera, canvasState.mode]
  )

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Pressing || canvasState.mode === CanvasMode.None) {
        unselectLayers()
        setCanvasState({
          mode: CanvasMode.None
        })
      } else if (canvasState.mode === CanvasMode.Inserting) {
        // @ts-ignore
        insertLayer(canvasState.layerType, point)
      } else {
        setCanvasState({
          mode: CanvasMode.None
        })
      }

      history.resume()
    },
    [camera, canvasState, insertLayer, history, unselectLayers]
  )

  const selections = useOthersMapped((other) => other.presence.selection)

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
        return
      }

      history.pause()
      e.stopPropagation()

      const point = pointerEventToCanvasPoint(e, camera)

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence(
          {
            selection: [layerId]
          },
          { addToHistory: true }
        )
      }
      setCanvasState({
        mode: CanvasMode.Translating,
        current: point
      })
    },
    [setCanvasState, camera, history, canvasState.mode]
  )

  const layerIdsToColorSelection = useMemo(() => {
    const result: Record<string, string> = {}

    for (const user of selections) {
      const [connectionId, selection] = user

      for (const layerId of selection) {
        result[layerId] = connectionIdToColor(connectionId)
      }
    }

    return result
  }, [selections])

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
      <SelectionTools
        setLastUsedColor={setLastUsedColor}
        camera={camera}
      />
      <svg
        className='h-screen w-screen bg-green-400'
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          <CursorsPresence />
        </g>
      </svg>
    </main>
  )
}
