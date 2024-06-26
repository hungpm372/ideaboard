'use client'

import { useDisableScrollBounce } from '@/hooks/use-disable-scroll-bounce'
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds
} from '@/lib/utils'
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CursorsPresence } from './cursors-presence'
import { Info } from './info'
import { LayerPreview } from './layer-preview'
import { Participants } from './participants'
import { Path } from './path'
import { SelectionBox } from './selection-box'
import { SelectionTools } from './selection-tools'
import { Toolbar } from './toolbar'
import { useDeleteLayers } from '@/hooks/use-delete-layers'

const MAX_LAYERS = 100

interface CanvasProps {
  boardId: string
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds)
  const pencilDraft = useSelf((self) => self.presence.pencilDraft)

  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None })
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0
  })

  useDisableScrollBounce()
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

  const updateSelectionNet = useMutation(
    ({ setMyPresence, storage }, current: Point, origin: Point) => {
      const layers = storage.get('layers').toImmutable()
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current
      })

      const ids = findIntersectingLayersWithRectangle(layerIds, layers, origin, current)

      setMyPresence({
        selection: ids
      })
    },
    [layerIds]
  )

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current
      })
    }
  }, [])

  const startDrawing = useMutation(
    ({ storage, setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor
      })
    },
    [lastUsedColor]
  )

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence

      if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || !pencilDraft) return

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]]
      })
    },
    [canvasState.mode]
  )

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get('layers')
      const { pencilDraft } = self.presence

      if (!pencilDraft || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS) {
        setMyPresence({
          pencilDraft: null
        })
        return
      }

      const id = nanoid()
      liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor)))

      const liveLayerIds = storage.get('layerIds')
      liveLayerIds.push(id)

      setMyPresence({
        pencilDraft: null,
        selection: [id]
      })

      setCanvasState({
        mode: CanvasMode.Pencil
      })
    },
    [lastUsedColor]
  )

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

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin)
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin)
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current)
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current)
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e)
      }

      setMyPresence({
        cursor: current
      })
    },
    [
      camera,
      canvasState,
      continueDrawing,
      updateSelectionNet,
      resizeSelectedLayer,
      startMultiSelection,
      translateSelectedLayers
    ]
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

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure)
        return
      }

      setCanvasState({
        mode: CanvasMode.Pressing,
        origin: point
      })
    },
    [camera, canvasState.mode, startDrawing]
  )

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Pressing || canvasState.mode === CanvasMode.None) {
        unselectLayers()
        setCanvasState({
          mode: CanvasMode.None
        })
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath()
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
    [camera, canvasState, insertLayer, history, unselectLayers, insertPath, setCanvasState]
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

  const deleteLayers = useDeleteLayers()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            history.undo()
          }
          break
        case 'y':
          if (e.ctrlKey || e.metaKey) {
            history.redo()
          }
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [history, deleteLayers])

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
      <SelectionTools setLastUsedColor={setLastUsedColor} camera={camera} />
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
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              className='fill-blue-500/5 stroke-blue-500 stroke-1'
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
          <CursorsPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path x={0} y={0} points={pencilDraft} fill={colorToCss(lastUsedColor)} />
          )}
        </g>
      </svg>
    </main>
  )
}
