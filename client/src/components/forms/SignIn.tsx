import { FC, useEffect, useState } from 'react'
import { StyledFirebaseAuth } from 'react-firebaseui'
import fire from '../../util/fire'

// Configure FirebaseUI
const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [fire.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
}

const SignIn: FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false) // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = fire.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user)
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [])

  if (!isSignedIn) {
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={fire.auth()} />
  }
  return null
}

export default SignIn
