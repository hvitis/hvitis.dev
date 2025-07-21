import QRCodeMaker from '@/components/QRCodeMaker/QRCodeMaker'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'QR Code Maker',
  description: 'Create your own QR codes for free. Just enter a link and download the QR code as a PNG or SVG file.',
})

export default function Page() {
  return (
    <>
      <QRCodeMaker />
    </>
  )
}
