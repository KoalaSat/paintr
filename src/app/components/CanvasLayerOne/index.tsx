import { PixelBoardContext } from 'app/contexts/pixelBoardContext'
import React, { useContext, useEffect, useMemo, useRef } from 'react'

const PIXEL_SIZE = 10

const CanvasLayerOne: React.FC = () => {
  const { selectedPixel, setSelectedPixel, canvasMainRef } = useContext(PixelBoardContext)
  const canvasOneRef = useRef<any>()

  const selectPixelIcon = useMemo(() => {
    const selectPixelIcon = new Image(10, 10)
    selectPixelIcon.src = '/select-icon.png'
    return selectPixelIcon
  }, [])

  const selectPixelIconWhite = useMemo(() => {
    const selectPixelIcon = new Image(10, 10)
    selectPixelIcon.src = '/select-icon-white.png'
    return selectPixelIcon
  }, [])

  useEffect(() => {
    const canvas = canvasMainRef.current

    if (!canvas) return

    const context = canvas.getContext('2d')

    const selectPixelIcon = new Image(10, 10)
    selectPixelIcon.src = '/select-icon.png'

    const selectPixelIconWhite = new Image(10, 10)
    selectPixelIconWhite.src = '/select-icon-white.png'
    const handleCanvasClick = (event): void => {
      context.clearRect(0, 0, canvas.width, canvas.height)

      const pixelX = Math.floor(event.offsetX / PIXEL_SIZE) * PIXEL_SIZE
      const pixelY = Math.floor(event.offsetY / PIXEL_SIZE) * PIXEL_SIZE

      setSelectedPixel({
        x: pixelX,
        y: pixelY,
        created_at: 0,
      })
    }

    canvas.addEventListener('click', handleCanvasClick)

    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
    }
  }, [])

  useEffect(() => {
    if (selectedPixel) {
      const canvas = canvasMainRef.current

      if (!canvas) return

      const context = canvas.getContext('2d')

      const canvasMainRefContext = canvasOneRef.current.getContext('2d')
      const pixelData = canvasMainRefContext.getImageData(
        selectedPixel.x,
        selectedPixel.y,
        1,
        1,
      ).data
      const isPixelBlack = pixelData[0] + pixelData[1] + pixelData[2] + pixelData[3] === 357
      if (isPixelBlack) {
        context.drawImage(selectPixelIconWhite, selectedPixel.x, selectedPixel.y)
      } else {
        context.drawImage(selectPixelIcon, selectedPixel.x, selectedPixel.y)
      }
    }
  }, [selectedPixel])

  return <canvas ref={canvasOneRef} height='340' width='340' style={{ top: 340 }}></canvas>
}

export default CanvasLayerOne
