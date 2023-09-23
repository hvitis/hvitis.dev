const dictionaries = {
  en: () => import('../locales/en.json').then((module) => module.default),
  pl: () => import('../locales/pl.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
