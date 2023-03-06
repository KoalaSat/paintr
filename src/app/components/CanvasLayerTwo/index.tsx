import { Pixel, PixelBoardContext } from 'app/contexts/pixelBoardContext'
import { useContext, useEffect } from 'react'

const CanvasLayerTwo: React.FC = () => {
  const { pixels, lastPixel, canvasTwoRef, height, width, pixelSize } =
    useContext(PixelBoardContext)
  const placePixel = (pixel: Pixel): void => {
    if (!pixel) return

    const context = canvasTwoRef.current.getContext('2d')
    const pixelX = Math.floor(pixel.x / pixelSize) * pixelSize
    const pixelY = Math.floor(pixel.y / pixelSize) * pixelSize
    context.fillStyle = pixel.color
    context.fillRect(pixelX, pixelY, pixelSize, pixelSize)
  }

  useEffect(() => {
    const context = canvasTwoRef.current.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }, [])

  useEffect(() => {
    Object.values(pixels).forEach(placePixel)
  }, [pixels, lastPixel])

  return (
    <canvas
      ref={canvasTwoRef}
      height={height}
      width={width}
      style={{ position: 'absolute' }}
    ></canvas>
  )
}

export default CanvasLayerTwo
