import { PixelBoardContext } from 'app/contexts/pixelBoardContext'
import React, { useContext, useEffect, useMemo } from 'react'

const DARK_COLORS = [256, 513, 422]

const CanvasLayerOne: React.FC = () => {
  const {
    selectedPixel,
    setSelectedPixel,
    pixels,
    canvasOneRef,
    canvasTwoRef,
    height,
    width,
    pixelSize,
  } = useContext(PixelBoardContext)

  const selectPixelIcon = useMemo(() => {
    const selectPixelIcon = new Image(pixelSize, pixelSize)
    selectPixelIcon.src = '/select-icon.png'
    return selectPixelIcon
  }, [])

  const selectPixelIconWhite = useMemo(() => {
    const selectPixelIcon = new Image(pixelSize, pixelSize)
    selectPixelIcon.src = '/select-icon-white.png'
    return selectPixelIcon
  }, [])

  useEffect(() => {
    const canvas = canvasOneRef.current

    if (!canvas) return

    const context = canvas.getContext('2d')

    const handleCanvasClick = (event): void => {
      context.clearRect(0, 0, canvas.width, canvas.height)

      const pixelX = Math.floor(event.offsetX / pixelSize) * pixelSize
      const pixelY = Math.floor(event.offsetY / pixelSize) * pixelSize

      setSelectedPixel(
        pixels[`${pixelX}${pixelY}`] ?? {
          id: '',
          x: pixelX,
          y: pixelY,
          created_at: 0,
          color: '',
          author: '',
        },
      )
    }

    canvas.addEventListener('click', handleCanvasClick)

    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
    }
  }, [])

  useEffect(() => {
    if (selectedPixel) {
      const canvas = canvasOneRef.current

      if (!canvas) return

      const context = canvas.getContext('2d')

      const canvasTwoContext = canvasTwoRef.current.getContext('2d')
      const pixelData = canvasTwoContext.getImageData(selectedPixel.x, selectedPixel.y, 1, 1).data
      const colorCode: number = pixelData[0] + pixelData[1] + pixelData[2] + pixelData[3]
      if (DARK_COLORS.includes(colorCode)) {
        context.drawImage(selectPixelIconWhite, selectedPixel.x, selectedPixel.y)
      } else {
        context.drawImage(selectPixelIcon, selectedPixel.x, selectedPixel.y)
      }
    }
  }, [selectedPixel])

  return (
    <canvas
      ref={canvasOneRef}
      height={height}
      width={width}
      style={{ position: 'absolute' }}
    ></canvas>
  )
}

export default CanvasLayerOne
