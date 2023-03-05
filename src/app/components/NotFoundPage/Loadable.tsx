/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/lazyLoad'

export const NotFoundPage = lazyLoad(
  async () => await import('./index'),
  (module) => module.NotFoundPage,
)
