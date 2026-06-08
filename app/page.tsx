"use client"

import { useEffect, useState } from "react"
import { AuthForm } from "@/components/auth-form"
import { Dashboard } from "@/components/dashboard"
import { getCurrentUser, seedIfNeeded } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"
import { InstallAppButton } from "@/components/install-app-button"

export default function Page() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedIfNeeded()
    setAuthed(!!getCurrentUser())
    setReady(true)
  }, [])

  return (
    <>
      {ready && (authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <AuthForm onSuccess={() => setAuthed(true)} />)}
      <InstallAppButton />
      <Toaster richColors position="top-center" />
    </>
  )
}
