import React, { useEffect, useMemo, useState } from 'react'
import { Event, Filter, getEventHash, signEvent, SimplePool, Sub } from 'nostr-tools'
import { getUnixTime } from 'date-fns'

export interface RelayPoolContextType {
  relayUrls: string[]
  addRelays: (relayUrl: string[]) => void
  metadata: Record<string, Event>
  addMetadata: (metadata: Event) => void
  loading: boolean
  publicKey: string
  setPublicKey: (publicKey: string) => void
  privateKey: string | undefined
  setPrivateKey: (privateKey: string) => void
  relayPool: SimplePool
  publish: (content: string) => void
  get: (filter: Filter) => Promise<Event | null>
  subscription: Sub | null
}

interface RelayPoolProviderProps {
  children: React.ReactNode
}

const intialRelayPoolContext: RelayPoolContextType = {
  relayUrls: [],
  addRelays: () => {},
  metadata: {},
  addMetadata: () => {},
  loading: true,
  publicKey: '',
  setPublicKey: () => {},
  privateKey: '',
  setPrivateKey: () => {},
  relayPool: new SimplePool(),
  publish: () => {},
  get: async () => null,
  subscription: null,
}

export const RelayPoolContext = React.createContext<RelayPoolContextType>(intialRelayPoolContext)
const RelayPoolProvider: React.FC<RelayPoolProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [publicKey, setPublicKey] = useState<string>(intialRelayPoolContext.publicKey)
  const [privateKey, setPrivateKey] = useState<string>()
  const [metadata, setMetadata] = useState<Record<string, Event>>({})
  const [relayUrls, setRelayUrls] = useState<string[]>(['wss://nostr.island.network'])
  const [subscription, setSubscription] = useState<Sub | null>(null)
  const relayPool = useMemo(() => {
    return new SimplePool()
  }, [])

  const mainSubscription: (relays: string[]) => void = (relays) => {
    if (publicKey) {
      const sub = relayPool.sub(relays, [
        {
          kinds: [30078],
          '#a': ['paintr'],
        },
      ])
      sub.on('event', (event) => {})
      setSubscription(sub)
      setLoading(false)
    }
  }

  useEffect(() => mainSubscription(relayUrls), [privateKey, publicKey])

  const addRelays: (urls: string[]) => void = (urls) => {
    subscription?.unsub()
    setLoading(true)
    let newRelays = [...relayUrls, ...urls]
    newRelays = newRelays.filter((item, index, array) => array.indexOf(item) === index)
    setRelayUrls(newRelays)
    mainSubscription(newRelays)
  }

  const addMetadata: (metadata: Event) => void = (metadata) => {
    if (metadata) {
      setMetadata((prev) => {
        prev[metadata?.pubkey] = metadata
        return prev
      })
    }
  }

  const generateEvent: (content: string) => Event | null = (content) => {
    if (!publicKey || !privateKey) return null

    const event: Event = {
      kind: 30078,
      pubkey: publicKey,
      created_at: getUnixTime(new Date()),
      tags: [['a', 'paintr']],
      content: content ?? '',
      id: '',
      sig: '',
    }
    event.id = getEventHash(event)
    event.sig = signEvent(event, privateKey)

    return event
  }

  const publish: (content: string) => void = (content) => {
    const event = generateEvent(content)

    if (event) {
      relayPool.publish(relayUrls, event)
    }
  }

  const get: (filter: Filter) => Promise<Event | null> = async (filter) => {
    return await relayPool.get(relayUrls, filter)
  }

  return (
    <RelayPoolContext.Provider
      value={{
        relayUrls,
        addRelays,
        loading,
        publicKey,
        setPublicKey,
        privateKey,
        setPrivateKey,
        relayPool,
        publish,
        get,
        subscription,
        metadata,
        addMetadata,
      }}
    >
      {children}
    </RelayPoolContext.Provider>
  )
}

export default RelayPoolProvider
