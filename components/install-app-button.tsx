"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent)
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker.register("/sw.js").catch(() => {})
  }, [])

  useEffect(() => {
    if (isStandalone() || !isMobile()) return

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    function handleAppInstalled() {
      setInstallPrompt(null)
      setVisible(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!installPrompt) return

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice

    if (choice.outcome === "accepted") {
      setVisible(false)
    }

    setInstallPrompt(null)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border bg-card p-4 shadow-xl sm:hidden">
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold">Installer NoteGest</p>
          <p className="text-sm text-muted-foreground">Ajoutez l'application à votre écran d'accueil.</p>
        </div>
        <Button onClick={handleInstall} className="h-11 gap-2">
          <Download className="size-4" />
          Installer l'application
        </Button>
      </div>
    </div>
  )
}
