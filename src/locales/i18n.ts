import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en/translation.json'

/* eslint-disable import/no-duplicates */
import setDefaultOptions from 'date-fns/setDefaultOptions'
import { enUS as dateEnUS, es as dateEs } from 'date-fns/locale'
/* eslint-enable import/no-duplicates */

const dateLocales: Record<string, Locale> = {
  es: dateEs,
  en: dateEnUS,
}
const deviceLocale: string = 'en'
setDefaultOptions({ locale: dateLocales[deviceLocale] })

export const translationsJson = {
  en: {
    translation: en,
  },
}

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: translationsJson,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
