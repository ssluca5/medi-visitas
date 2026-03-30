'use client'

import { SignUp } from '@clerk/nextjs'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: 'rgb(var(--accent))',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  )
}
