import { SignedIn, UserButton } from '@clerk/nextjs'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      home page

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default HomePage
