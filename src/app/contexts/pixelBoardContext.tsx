import React, { useEffect, useRef, useState } from 'react'
import { RelayPoolContext } from './relayPoolContext'
import { Event } from 'nostr-tools'

export interface Pixel {
  x: number
  y: number
  id: string
  created_at: number
  color: string
  author: string
}

export interface PixelBoardContextType {
  pixels: Record<string, Pixel>
  authors: Record<string, number>
  banned: string[]
  loading: boolean
  selectedPixel: Pixel | null
  setSelectedPixel: (selectedPixel: Pixel | null) => void
  canvasOneRef: any
  canvasTwoRef: any
  lastPixel: Pixel | null
  height: number
  width: number
  pixelSize: number
}

interface PixelBoardProviderProps {
  children: React.ReactNode
}

const intialPixelBoardContext: PixelBoardContextType = {
  pixels: {},
  authors: {},
  banned: [],
  loading: true,
  selectedPixel: null,
  setSelectedPixel: () => {},
  canvasOneRef: {},
  canvasTwoRef: {},
  lastPixel: null,
  height: 1024,
  width: 2048,
  pixelSize: 8,
}

export const PixelBoardContext = React.createContext<PixelBoardContextType>(intialPixelBoardContext)
const PixelBoardProvider: React.FC<PixelBoardProviderProps> = ({ children }) => {
  const { subscription } = React.useContext(RelayPoolContext)
  const [loading] = useState<boolean>(intialPixelBoardContext.loading)
  const [pixels, setPixels] = useState<Record<string, Pixel>>(intialPixelBoardContext.pixels)
  const [authors, setAuthors] = useState<Record<string, number>>(intialPixelBoardContext.authors)
  const [banned, setBanned] = useState<string[]>([])
  const [lastPixel, setLastPixel] = useState<Pixel | null>(null)
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null)
  const [height] = useState<number>(intialPixelBoardContext.height)
  const [width] = useState<number>(intialPixelBoardContext.width)
  const [pixelSize] = useState<number>(intialPixelBoardContext.pixelSize)
  const canvasOneRef = useRef<any>()
  const canvasTwoRef = useRef<any>()

  useEffect(() => {
    if (subscription) {
      subscription.on('event', (event: Event) => {
        if (
          event &&
          /\d{1,4}:\d{1,4}:#[0-9a-f]{6}/.test(event.content) &&
          !banned.includes(event.pubkey)
        ) {
          const [x, y, color] = event.content.split(':')

          if (authors[event.pubkey]) {
            const diff = authors[event.pubkey] - event.created_at
            if (Math.abs(diff) < 59) {
              setBanned((prev) => {
                prev.push(event.pubkey)
                return prev
              })
              return
            }
          }

          const newPixel: Pixel = {
            id: event.id,
            x: parseInt(x),
            y: parseInt(y),
            color,
            created_at: event.created_at,
            author: event.pubkey,
          }
          setPixels((prev) => {
            prev[`${x}${y}`] = newPixel
            return prev
          })
          setAuthors((prev) => {
            prev[event.pubkey] = event.created_at
            return prev
          })
          setLastPixel(newPixel)
          if (selectedPixel?.x === newPixel.x && selectedPixel?.y === newPixel.y) {
            setSelectedPixel(newPixel)
          }
        }
      })
    }
  }, [subscription])

  return (
    <PixelBoardContext.Provider
      value={{
        pixels,
        authors,
        banned,
        lastPixel,
        loading,
        selectedPixel,
        setSelectedPixel,
        canvasOneRef,
        canvasTwoRef,
        height,
        width,
        pixelSize,
      }}
    >
      {children}
    </PixelBoardContext.Provider>
  )
}

export default PixelBoardProvider
