import React, { useEffect, useMemo, useState } from 'react'
import { Event, Filter, getEventHash, signEvent, SimplePool, Sub } from 'nostr-tools'
import { getUnixTime } from 'date-fns'
import { fallbackRelays } from 'app/contants'
import { randomInt } from 'app/Functions/Math'

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
  nip06Available: boolean
  nip06: boolean
  setNip06: (nip06: boolean) => void
  get: (filter: Filter) => Promise<Event | null>
  subscription: Sub | null
  finishEvent: (event: Event) => Promise<Event | null>
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
  nip06Available: false,
  nip06: false,
  setNip06: () => {},
  finishEvent: async () => null,
  get: async () => null,
  subscription: null,
}

export const RelayPoolContext = React.createContext<RelayPoolContextType>(intialRelayPoolContext)
const RelayPoolProvider: React.FC<RelayPoolProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [publicKey, setPublicKey] = useState<string>(intialRelayPoolContext.publicKey)
  const [privateKey, setPrivateKey] = useState<string>()
  const [metadata, setMetadata] = useState<Record<string, Event>>({})
  const [relayUrls, setRelayUrls] = useState<string[]>([])
  const [nip06, setNip06] = useState<boolean>(false)
  const [subscription, setSubscription] = useState<Sub | null>(null)
  const nip06Available = useMemo<boolean>(() => window.nostr?.getPublicKey !== undefined, [])
  const relayPool = useMemo(() => {
    return new SimplePool()
  }, [])

  const mainSubscription: (relays: string[]) => void = (relays) => {
    if (publicKey) {
      const sub = relayPool.sub(relays, [
        {
          kinds: [30078],
          '#a': ['paintr.click'],
        },
      ])
      sub.on('event', (event) => {})
      setSubscription(sub)
      setLoading(false)
    }
  }

  useEffect(() => {
    const localRelaysJson = localStorage.getItem('relays')
    if (localRelaysJson && localRelaysJson !== '') {
      const localRelays = JSON.parse(localRelaysJson)
      setRelayUrls(localRelays)
    } else {
      const relays: string[] = ['wss://brb.io']
      while (relays.length < 5) {
        const randomRelayIndex = randomInt(0, fallbackRelays.length - 1)
        if (!relays.includes(fallbackRelays[randomRelayIndex])) {
          relays.push(fallbackRelays[randomRelayIndex])
        }
      }
      localStorage.setItem('relays', JSON.stringify(relays))
      setRelayUrls(relays)
    }
  }, [])

  useEffect(() => mainSubscription(relayUrls), [privateKey, publicKey])

  const addRelays: (urls: string[]) => void = (urls) => {
    setLoading(true)
    relayPool?.close(relayUrls)
    setRelayUrls(urls)
    localStorage.setItem('relays', JSON.stringify(urls))
    mainSubscription(urls)
  }

  const addMetadata: (metadata: Event) => void = (metadata) => {
    if (metadata) {
      setMetadata((prev) => {
        prev[metadata?.pubkey] = metadata
        return prev
      })
    }
  }

  const finishEvent: (event: Event) => Promise<Event | null> = async (event) => {
    event.id = getEventHash(event)
    if (nip06) {
      event = await window.nostr.signEvent(event)
      return event
    } else if (privateKey) {
      event.sig = signEvent(event, privateKey)
      return event
    } else {
      return null
    }
  }

  const generateEvent: (content: string) => Promise<Event | null> = async (content) => {
    if (!publicKey || (!privateKey && !nip06)) return null

    const event: Event = {
      kind: 30078,
      pubkey: publicKey,
      created_at: getUnixTime(new Date()),
      tags: [['a', 'paintr.click']],
      content: content ?? '',
      id: '',
      sig: '',
    }

    return await finishEvent(event)
  }

  const publish: (content: string) => void = async (content) => {
    const event = await generateEvent(content)

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
        nip06,
        setNip06,
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
        nip06Available,
        finishEvent,
      }}
    >
      {children}
    </RelayPoolContext.Provider>
  )
}

export default RelayPoolProvider
