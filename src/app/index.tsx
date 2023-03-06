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

import { HomePage } from './pages/HomePage/Loadable'
import { NotFoundPage } from './components/NotFoundPage/Loadable'
import { I18nextProvider } from 'react-i18next'
import RelayPoolProvider from './contexts/relayPoolContext'
import PixelBoardProvider from './contexts/pixelBoardContext'
import i18n from 'locales/i18n'

export const App: () => JSX.Element = () => {
  return (
    <RelayPoolProvider>
      <PixelBoardProvider>
        <BrowserRouter>
          <Helmet
            titleTemplate='%s - React Boilerplate'
            defaultTitle='React Boilerplate'
            htmlAttributes={{ lang: i18n.language }}
          >
            <meta name='description' content='A React Boilerplate application' />
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
  )
}
