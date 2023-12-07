import { Button } from '@nextui-org/react'
import { getUserLocale, getUserLocales } from 'get-user-locale'
import { LanguagesIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'

const LanguageSwitch = () => {
  const userLocale = getUserLocale()
  let userLocales = getUserLocales()
  userLocales = userLocales.filter((lang) => lang.length === 2)

  const [locale, setLocale] = useLocalStorage('locale', 'en')

  useEffect(() => {
    if (userLocales.includes('pl')) {
      setLocale('pl')
    }
  }, [])

  const handleLanguageSwitch = () => {
    if (locale === 'pl') {
      setLocale('en')
    } else {
      setLocale('pl')
    }
  }

  return (
    <>
      <Button
        id="language-switch"
        onClick={handleLanguageSwitch}
        isIconOnly
        color="default"
        variant="faded"
        aria-label="Change the language"
      >
        {/* <LanguagesIcon className="w-4 h-4"></LanguagesIcon> */}
        <span className="uppercase">{locale === 'pl' ? '🇺🇸' : '🇵🇱'}</span>
      </Button>
    </>
  )
}

export default LanguageSwitch
