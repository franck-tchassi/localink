import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer';

type Props = {
  children: React.ReactNode;
}

const LandingLayout = ({children}: Props) => {
  return (
    <div>
        <Header />
      <main className="min-h-screen bg-background">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default LandingLayout