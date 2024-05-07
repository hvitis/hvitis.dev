import * as React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'
import Hero from '@/components/MosaicArtMaker/MosaicHero'
import Footer from '@/components/MosaicArtMaker/MosaicFooter'
import { genPageMetadata } from 'app/seo'

const MosaicArtMaker = dynamic(() => import('@/components/MosaicArtMaker/MosaicArtMaker'), {
  ssr: false,
  loading: () => <Loader />,
})

export const metadata = genPageMetadata({
  title: 'Best LEGO Mosaic Maker',
  description: 'Adjust colors, studs and export in all formats. Lego makers love it!',
  image: '/static/images/pages/mosaic-art-maker.png',
})

const LEGOArt: React.FunctionComponent = () => {
  return (
    <>
      <div className="w-full mx-auto text-center ">
        <Hero />
        <MosaicArtMaker />
        <Footer />
      </div>
    </>
  )
}

export default LEGOArt
