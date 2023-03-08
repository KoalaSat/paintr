/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { GlobalStyle } from 'styles/global-styles'
import { Event } from 'nostr-tools'

import { HomePage } from './pages/HomePage/Loadable'
import { NotFoundPage } from './components/NotFoundPage/Loadable'
import { I18nextProvider } from 'react-i18next'
import RelayPoolProvider from './contexts/relayPoolContext'
import PixelBoardProvider from './contexts/pixelBoardContext'
import i18n from 'locales/i18n'
import { ConfigProvider, theme } from 'antd'

declare global {
  interface Window {
    nostr: {
      enabled: boolean
      getPublicKey: () => string
      signEvent: (event: Event) => Promise<Event>
    }
  }
}

export const App: () => JSX.Element = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#4A1A6C',
          colorSuccess: '#00b96b',
          colorWarning: '#FEB95F',
          colorError: '#F71735',
          colorInfo: '#3772FF',
        },
      }}
    >
      <RelayPoolProvider>
        <PixelBoardProvider>
          <BrowserRouter>
            <Helmet
              titleTemplate='%s - Paintr'
              defaultTitle='Paintr'
              htmlAttributes={{ lang: i18n.language }}
            >
              <meta name='description' content='Paintr' />
            </Helmet>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </I18nextProvider>
            <GlobalStyle />
          </BrowserRouter>
        </PixelBoardProvider>
      </RelayPoolProvider>
    </ConfigProvider>
  )
}
