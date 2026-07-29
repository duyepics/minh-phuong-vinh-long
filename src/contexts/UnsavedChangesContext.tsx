'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface UnsavedChangesContextType {
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  requestNavigation: (targetHref: string, onConfirmAction?: () => void) => boolean
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined)

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const [isDirty, setIsDirty] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingTarget, setPendingTarget] = useState<{
    href?: string
    action?: () => void
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const requestNavigation = useCallback(
    (targetHref: string, onConfirmAction?: () => void) => {
      if (!isDirty) {
        if (onConfirmAction) {
          onConfirmAction()
        } else if (targetHref) {
          router.push(targetHref)
        }
        return true
      }

      setPendingTarget({ href: targetHref, action: onConfirmAction })
      setShowConfirmModal(true)
      return false
    },
    [isDirty, router]
  )

  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    setIsDirty(false)
    if (pendingTarget) {
      if (pendingTarget.action) {
        pendingTarget.action()
      } else if (pendingTarget.href) {
        router.push(pendingTarget.href)
      }
    }
    setPendingTarget(null)
  }

  const handleCancelExit = () => {
    setShowConfirmModal(false)
    setPendingTarget(null)
  }

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setIsDirty, requestNavigation }}>
      {children}

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thoát không lưu thay đổi?</DialogTitle>
            <DialogDescription>
              Bạn đang có những thông tin chưa được lưu trên trang này. Nếu chuyển trang ngay bây giờ, các thay đổi của bạn sẽ bị mất. Bạn có chắc chắn muốn thoát không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="dash-btn-secondary"
              onClick={handleCancelExit}
            >
              Ở lại trang này
            </button>
            <button
              type="button"
              className="dash-btn-primary !bg-red-600 hover:!bg-red-700 !text-white"
              onClick={handleConfirmExit}
            >
              Chuyển trang không lưu
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UnsavedChangesContext.Provider>
  )
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext)
  if (!context) {
    // Return dummy fallback if used outside provider
    return {
      isDirty: false,
      setIsDirty: () => {},
      requestNavigation: (href: string, action?: () => void) => {
        if (action) action()
        return true
      },
    }
  }
  return context
}
