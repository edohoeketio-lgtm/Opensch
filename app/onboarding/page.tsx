'use client'

import { useState } from 'react'
import { syncOnboardingProfile } from '@/app/actions/onboarding'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    githubUrl: '',
    bio: '',
    timezone: 'UTC-5 (EST)',
    experienceLevel: 'Beginner',
  })

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await syncOnboardingProfile(formData)
      window.location.href = '/dashboard'
    } catch (err) {
      console.error('Failed to sync profile:', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden text-neutral-200 font-sans selection:bg-neutral-800 selection:text-white pb-32 pt-20">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-neutral-900/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-900/40 blur-[120px] pointer-events-none opacity-30" />
      
      {/* Container */}
      <div className="w-full max-w-xl p-8 relative z-10">
        
        {/* Progress Logic */}
        <div className="flex items-center space-x-2 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-neutral-900 overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-500 ease-out`}
                style={{ width: step >= i ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">
              Set up your profile
            </h1>
            <p className="text-neutral-400 mb-8">
              This is how you will appear to other students on the Campus Feed and Student Roster.
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 block ml-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="e.g. Satoshi Nakamoto" 
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-lg px-4 py-3 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 block ml-1 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-neutral-600 font-medium">@</span>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    placeholder="satoshi" 
                    className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-lg pl-9 pr-4 py-3 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 block ml-1 uppercase tracking-wider">
                  Short Bio
                </label>
                <textarea 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  placeholder="What are you currently building?" 
                  rows={3}
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-lg px-4 py-3 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all text-sm resize-none"
                />
              </div>

              <button 
                onClick={handleNext}
                disabled={!formData.fullName || !formData.username}
                className="w-full bg-white text-black font-medium rounded-lg px-4 py-3 mt-4 text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Connections & Logistics */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">
              Developer Connections
            </h1>
            <p className="text-neutral-400 mb-8">
              Connect your GitHub to import repositories and submit deliverables natively.
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 block ml-1 uppercase tracking-wider">
                  GitHub Profile URL
                </label>
                <input 
                  type="url" 
                  value={formData.githubUrl}
                  onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                  placeholder="https://github.com/username" 
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-lg px-4 py-3 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-xs font-medium text-neutral-400 block ml-1 uppercase tracking-wider">
                  Primary Timezone
                </label>
                <select 
                  value={formData.timezone}
                  onChange={e => setFormData({...formData, timezone: e.target.value})}
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all text-sm appearance-none"
                >
                  <option>UTC-8 (PST)</option>
                  <option>UTC-5 (EST)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (CET)</option>
                  <option>UTC+8 (CST)</option>
                  <option>UTC+9 (JST)</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={handleBack}
                  className="w-1/3 bg-neutral-900 border border-neutral-800 text-white font-medium rounded-lg px-4 py-3 text-sm hover:bg-neutral-800 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  className="w-2/3 bg-white text-black font-medium rounded-lg px-4 py-3 text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Architecture Context */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">
              Builder Context
            </h1>
            <p className="text-neutral-400 mb-8">
              We tailor your AI interactions based on your builder profile. Let us know your experience with AI-assisted IDEs like Google Antigravity.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'Beginner', title: 'Visionary', desc: 'Zero coding experience. I want to learn how to prompt AI IDEs like Google Antigravity and Claude to build my ideas.' },
                  { id: 'Intermediate', title: 'Tinkerer', desc: 'I know some basics or no-code tools, but I am ready to use AI to build full-stack web apps.' },
                  { id: 'Advanced', title: 'AI-Native', desc: 'I am already using Google Antigravity or Claude daily to ship products, but want to master agentic architectures.' }
                ].map((level) => (
                  <div 
                    key={level.id}
                    onClick={() => setFormData({...formData, experienceLevel: level.id})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.experienceLevel === level.id 
                        ? 'bg-neutral-800/80 border-neutral-600 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                        : 'bg-neutral-950/40 border-neutral-800/80 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${formData.experienceLevel === level.id ? 'text-white' : 'text-neutral-300'}`}>
                        {level.title}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.experienceLevel === level.id ? 'border-white' : 'border-neutral-600'
                      }`}>
                        {formData.experienceLevel === level.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500">{level.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="w-1/3 bg-neutral-900 border border-neutral-800 text-white font-medium rounded-lg px-4 py-3 text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-2/3 flex items-center justify-center space-x-2 bg-white text-black font-medium rounded-lg px-4 py-3 text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Initializing OS...</span>
                    </>
                  ) : (
                    <span>Enter Academic OS</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
