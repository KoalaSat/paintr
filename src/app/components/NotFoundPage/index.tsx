import * as React from 'react'
import { P } from './P'
import { Helmet } from 'react-helmet-async'

export const NotFoundPage: () => JSX.Element = () => {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name='description' content='Page not found' />
      </Helmet>
      <div>
        <div>
          4
          <span role='img' aria-label='Crying Face'>
            😢
          </span>
          4
        </div>
        <P>Page not found.</P>
      </div>
    </>
  )
}
