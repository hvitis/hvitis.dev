import * as React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'
import Hero from '@/components/MosaicArtMaker/MosaicHero'
import Footer from '@/components/MosaicArtMaker/MosaicFooter'

const MosaicArtMaker = dynamic(() => import('@/components/MosaicArtMaker/MosaicArtMaker'), {
  ssr: false,
  loading: () => <Loader />,
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
