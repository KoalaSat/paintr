import React, { useRef, useState } from 'react'

export interface Pixel {
  x: number
  y: number
  created_at: number
}

export interface PixelBoardContextType {
  pixels: Pixel[]
  loading: boolean
  selectedPixel: Pixel | null
  setSelectedPixel: (selectedPixel: Pixel | null) => void
  canvasMainRef: any
}

interface PixelBoardProviderProps {
  children: React.ReactNode
}

const intialPixelBoardContext: PixelBoardContextType = {
  pixels: [],
  loading: true,
  selectedPixel: null,
  setSelectedPixel: () => {},
  canvasMainRef: {},
}

export const PixelBoardContext = React.createContext<PixelBoardContextType>(intialPixelBoardContext)
const PixelBoardProvider: React.FC<PixelBoardProviderProps> = ({ children }) => {
  const [loading] = useState<boolean>(intialPixelBoardContext.loading)
  const [pixels] = useState<Pixel[]>(intialPixelBoardContext.pixels)
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null)
  const canvasMainRef = useRef<any>()

  return (
    <PixelBoardContext.Provider
      value={{ pixels, loading, selectedPixel, setSelectedPixel, canvasMainRef }}
    >
      {children}
    </PixelBoardContext.Provider>
  )
}

export default PixelBoardProvider
