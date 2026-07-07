import ContactLayout from '@/layouts/ContactLayout'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Contact',
  description: 'Get in touch by e-mail.',
})

export default function Page() {
  return (
    <>
      <ContactLayout>
        <h1 className="leading">Write me an e-mail</h1>
        <p>Write me at: hello (at) youtalky.com</p>
      </ContactLayout>
    </>
  )
}
