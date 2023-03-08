// Thanks to v0l/snort for the nice code!
// https://github.com/v0l/snort/blob/39fbe3b10f94b7542df01fb085e4f164aab15fca/src/Feed/VoidUpload.ts

import { getUnixTime } from 'date-fns'
import { Event } from 'nostr-tools'
import { requestInvoiceWithServiceParams, requestPayServiceParams } from 'lnurl-pay'
import axios from 'axios'

export const lightningInvoice: (
  relays: string[],
  lud: string,
  tokens: number,
  finishEvent: (event: Event) => Promise<Event | null>,
  publicKey: string,
  userId: string,
  comment?: string,
  eventId?: string,
) => Promise<string | null> = async (
  relays,
  lud,
  tokens,
  finishEvent,
  publicKey,
  userId,
  comment = '',
  eventId,
) => {
  let nostr: string

  if (relays.length > 0 && finishEvent && publicKey && userId) {
    const tags = [
      ['p', userId],
      ['amount', (tokens * 1000).toString()],
      ['relays', relays[0]],
    ]
    if (eventId) tags.push(['e', eventId])

    const event: Event = {
      id: '',
      sig: '',
      content: comment,
      created_at: getUnixTime(new Date()),
      kind: 9734,
      pubkey: publicKey,
      tags,
    }
    const signedEvent = await finishEvent(event)
    nostr = JSON.stringify(signedEvent)
  }

  const serviceParams = await requestPayServiceParams({ lnUrlOrAddress: lud })

  return await new Promise<string>((resolve, reject) => {
    requestInvoiceWithServiceParams({
      params: serviceParams,
      lnUrlOrAddress: lud,
      // @ts-expect-error
      tokens,
      comment,
      fetchGet: async ({ url, params }) => {
        if (params && nostr && serviceParams.rawData.allowsNostr) {
          params.nostr = nostr
        }
        const response = await axios.get(url, {
          params,
        })
        return response.data
      },
    })
      .then((action) => {
        if (action.hasValidAmount && action.invoice) {
          resolve(action.invoice)
        }
      })
      .catch((e) => {
        reject(new Error())
      })
  })
}
