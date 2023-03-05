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
import { useTranslation } from 'react-i18next'
import RelayPoolProvider from './contexts/relayPoolContext'
import PixelBoardProvider from './contexts/pixelBoardContext'

export const App: () => JSX.Element = () => {
  const { i18n } = useTranslation()
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

          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
          <GlobalStyle />
        </BrowserRouter>
      </PixelBoardProvider>
    </RelayPoolProvider>
  )
}
