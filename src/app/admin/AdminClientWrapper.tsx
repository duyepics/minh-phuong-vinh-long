'use client'

import { UnsavedChangesProvider } from '@/contexts/UnsavedChangesContext'

export default function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  return <UnsavedChangesProvider>{children}</UnsavedChangesProvider>
}
