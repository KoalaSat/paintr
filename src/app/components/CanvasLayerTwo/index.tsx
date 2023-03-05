import { Pixel, PixelBoardContext } from 'app/contexts/pixelBoardContext'
import { useContext, useEffect } from 'react'

const PIXEL_SIZE = 10

const CanvasLayerTwo: React.FC = () => {
  const { pixels, canvasMainRef } = useContext(PixelBoardContext)
  const placePixel = (pixel): void => {
    const context = canvasMainRef.current.getContext('2d')
    const pixelX = Math.floor(pixel.x / PIXEL_SIZE) * PIXEL_SIZE
    const pixelY = Math.floor(pixel.y / PIXEL_SIZE) * PIXEL_SIZE
    context.fillStyle = pixel.color
    context.fillRect(pixelX, pixelY, PIXEL_SIZE, PIXEL_SIZE)
  }

  useEffect(() => {
    const context = canvasMainRef.current.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 340, 340)

    // if (canvasLayerTwoRef) {
    //     canvasLayerTwoRef.current = canvasMainRef.current;
    // }
  }, [])

  useEffect(() => {
    let allPixels: Pixel[] = []
    for (let i = 0; i < pixels.length; i++) {
      const pixel = pixels[i]

      if (!pixel) continue

      allPixels.push(pixel)
    }

    allPixels = allPixels.filter((pixel) => !pixel)
    allPixels.sort((a, b) => {
      if (a.created_at === null || b.created_at === null) {
        return -1
      }

      return a.created_at - b.created_at
    })

    for (let i = 0; i < allPixels.length; i++) {
      placePixel(allPixels[i])
    }
  }, [pixels])

  return <canvas ref={canvasMainRef} height='340' width='340'></canvas>
}

export default CanvasLayerTwo
