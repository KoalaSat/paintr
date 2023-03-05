/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/lazyLoad'

export const HomePage = lazyLoad(
  async () => await import('./index'),
  (module) => module.HomePage,
)
