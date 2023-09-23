import ContactLayout from '@/layouts/ContactLayout'
import NewsletterForm from 'pliny/ui/NewsletterForm'

export default function Page() {
  return (
    <>
      <ContactLayout>
        <h1 className="leading">Write me an e-mail</h1>
        <p>Write me at: hello (at) youtalky.com</p>
        <p>If you want to stay up to date with mosaic changes, you can subscribe to newsletter.</p>
        <NewsletterForm title="Subscribe" apiUrl="/api/newsletter" />
      </ContactLayout>
    </>
  )
}
