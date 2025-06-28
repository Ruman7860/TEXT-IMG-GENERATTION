import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonials from '../components/Testimonials'
import GenerateButton from '../components/GenerateButton'
import { useApp } from '../context/AppContent'

const Home = () => {
  const {user} = useApp();
  return (
    <div>
        <Header/>
        <Steps/>
        <Description/>
        <Testimonials/>
        <GenerateButton/>
    </div>
  )
}

export default Home