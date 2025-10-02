
import React from 'react'
import '../../css/Page.css'

interface WelcomeProps {
  success?: string;
}

export default function Welcome({ success }: WelcomeProps) {
  // Log success message when present
  React.useEffect(() => {
    if (success) {
      console.log('Login successful!');
    }
  }, [success]);

  return (
    <div>
      <h1>Welcome to Our Shop</h1>
      <p>We are glad to have you here.</p>
    </div>
  )
}
