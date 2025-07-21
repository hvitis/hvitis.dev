import QRCodeMaker from '@/components/QRCodeMaker/QRCodeMaker'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'QR Code Maker',
  description: 'Create your own QR codes for free. ',
})

export default function Page() {
  return (
    <>
      <QRCodeMaker />
    </>
  )
}
