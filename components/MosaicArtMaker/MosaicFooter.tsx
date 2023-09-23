'use client'
import { useReadLocalStorage } from 'usehooks-ts'

export default function MosaicFooter() {
  const locale = useReadLocalStorage('locale')
  return (
    <>
      <div>
        <div className="divider"></div>
        <p className="text-xs font-thin">
          {locale === 'pl'
            ? 'LEGO i logo LEGO są znakami towarowymi i/lub prawami autorskimi Grupy LEGO. Ten projekt nie jest w żaden sposób powiązany z Grupą LEGO i był po prostu moim projektem, w którym wykorzystałem nazwę LEGO jako zastrzeżoną eponim'
            : 'LEGO and the LEGO logo are trademarks and/or copyrights of the LEGO Group. This project is not at all affiliated with The LEGO Group, and was simply a project of mine using the LEGO name as a proprietary eponym'}
        </p>
      </div>
    </>
  )
}
