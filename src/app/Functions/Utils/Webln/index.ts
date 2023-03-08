// https://github.com/Reckless-Satoshi/robosats/blob/main/frontend/src/utils/webln.ts

import { requestProvider, WebLNProvider } from 'webln'

export const getWebln = async (): Promise<WebLNProvider> => {
  const resultPromise = new Promise<WebLNProvider>((resolve, reject) => {
    try {
      requestProvider().then((webln) => {
        if (webln) {
          webln.enable()
          resolve(webln)
        }
      })
    } catch (err) {
      reject(new Error("Coulnd't connect to Webln"))
    }
  })

  return await resultPromise
}
