import { getUserLocale, getUserLocales } from 'get-user-locale'
import { LanguagesIcon } from 'lucide-react'

const LanguageSwitcher = () => {
  console.log(getUserLocale())

  return (
    <>
      <LanguagesIcon className="w-4 h-4"></LanguagesIcon>
    </>
  )
}

export default LanguageSwitcher
