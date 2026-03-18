'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const supabase = createClient()

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })
    
    if (error) {
      console.error('Error logging in:', error)
      setLoading(null)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading('email')
    
    // TESTING BYPASS: Magic Links removed. We use a Universal Dummy Password to silently authenticate the session.
    const dummyPassword = "OpenSchTest-2026-Bypass!"

    // 1. Unconditionally attempt to create the account (it fails silently if they already exist)
    await supabase.auth.signUp({
      email,
      password: dummyPassword,
    })

    // 2. Unconditionally attempt to sign them into that account
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: dummyPassword,
    })

    if (error) {
       console.error('Error logging in:', error)
       alert(`Authentication Failed: ${error.message} \n\nIMPORTANT: You must go to your Supabase Dashboard -> Authentication -> Providers -> Email and turn OFF "Confirm email" for this to work.`)
    } else {
       // Success! The session cookie is set. Redirecting safely.
       window.location.href = '/onboarding'
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden text-neutral-200 font-sans selection:bg-neutral-800 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-neutral-900/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-900/40 blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-900/40 blur-[120px] pointer-events-none opacity-50" />

      {/* Main Auth Container */}
      <div className="w-full max-w-md p-8 relative z-10">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-neutral-900/80 rounded-xl border border-neutral-800 flex items-center justify-center mb-6 shadow-2xl backdrop-blur-xl">
            {/* Minimalist Logo Mark */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
            {isSignUp ? 'Create your account' : 'Welcome to OpenSch'}
          </h1>
          <p className="text-sm text-neutral-400 max-w-[280px]">
            {isSignUp ? 'Join the Academic Operating System.' : 'Sign in to access the Academic Operating System.'}
          </p>
        </div>

        {/* Auth Form Box */}
        <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-neutral-400 block ml-1 uppercase tracking-wider">
                Email Address
              </label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                required 
                className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-lg px-4 py-3 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 transition-all text-sm"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading !== null}
              className="w-full bg-white text-black font-medium flex justify-center items-center rounded-lg px-4 py-3 text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 disabled:opacity-50"
            >
              {loading === 'email' ? 'Sending Link...' : 'Continue with Email'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800/80"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f0f0f] px-3 font-medium text-neutral-500 tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* OAuth Providers */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleOAuthLogin('github')}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 bg-neutral-950/40 border border-neutral-800/80 hover:bg-neutral-900 text-neutral-300 transition-colors rounded-lg px-4 py-2.5 text-sm font-medium group disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>{loading === 'github' ? 'Connecting...' : 'GitHub'}</span>
            </button>

            <button 
              onClick={() => handleOAuthLogin('google')}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 bg-neutral-950/40 border border-neutral-800/80 hover:bg-neutral-900 text-neutral-300 transition-colors rounded-lg px-4 py-2.5 text-sm font-medium group disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{loading === 'google' ? 'Connecting...' : 'Google'}</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-neutral-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:underline font-medium transition-all"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <p className="text-xs text-neutral-600 max-w-[280px] mx-auto">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-neutral-400 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-neutral-400 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
