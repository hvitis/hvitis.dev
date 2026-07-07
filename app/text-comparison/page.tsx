import TextComparison from '@/components/TextComparison/TextComparison'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Text Comparison',
  description:
    'Compare two blocks of text and see the differences highlighted character by character, entirely in your browser.',
})

export default function Page() {
  return <TextComparison />
}
