import React, { useEffect, useState } from 'react'
import { generatePrivateKey, getPublicKey, Relay, relayInit } from 'nostr-tools'

export interface RelayPoolContextType {
  relays: Relay[]
  loading: boolean
}

interface RelayPoolProviderProps {
  children: React.ReactNode
}

export const RelayPoolContext = React.createContext<RelayPoolContextType | null>(null)
const RelayPoolProvider: React.FC<RelayPoolProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [publicKey, setPublicKey] = useState<string>()
  const [privateKey, setPrivateKey] = useState<string>()
  const [relays, setRelays] = useState<Relay[]>([])

  useEffect(() => {
    const sk = generatePrivateKey()
    const pk = getPublicKey(sk)
    setPublicKey(pk)
    setPrivateKey(sk)
  }, [])

  useEffect(() => {
    if (privateKey && publicKey) {
      const relay = relayInit('wss://nostr.island.network')
      relay.on('connect', () => {
        console.log(`connected to ${relay.url}`)
      })
      relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`)
      })

      relay.connect().then(() => {
        setRelays((prev) => {
          prev.push(relay)
          return prev
        })
        setLoading(false)
      })
    }
  }, [privateKey, publicKey])

  return (
    <RelayPoolContext.Provider value={{ relays, loading }}>{children}</RelayPoolContext.Provider>
  )
}

export default RelayPoolProvider
