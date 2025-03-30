import Gallery from '@/components/home/gallery'
import Hero from '@/components/home/hero'
import Navbar from '@/components/home/Navbar'
import { ModeToggle } from '@/components/themes/darktheme'
import React from 'react'

const page = () => {
  return (
     <div>
        <Hero/>
        <Gallery/>
     </div>
  )
}

export default page
