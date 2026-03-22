import { getAuthenticatedUser } from '@/lib/auth'
import OnboardingWizard from './OnboardingWizard'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const user = await getAuthenticatedUser()
  
  if (!user) {
    redirect('/login')
  }

  return <OnboardingWizard role={user.role} />
}
