"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Candidate, EditRecord, User } from "@/lib/types"
import { findCandidate, getCurrentUser, getEdits, logout } from "@/lib/store"
import { CandidateCard } from "@/components/candidate-card"
import { EditHistory } from "@/components/edit-history"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GraduationCap, LogOut, Search, SearchX } from "lucide-react"
import { toast } from "sonner"

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<User | null>(null)
  const [query, setQuery] = useState("")
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [edits, setEdits] = useState<EditRecord[]>([])

  useEffect(() => {
    setUser(getCurrentUser())
    setEdits(getEdits())
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const found = findCandidate(query)
    setCandidate(found)
    setNotFound(!found)
    if (!found) toast.error("Aucun candidat trouvé pour ce matricule.")
  }

  function handleLogout() {
    logout()
    onLogout()
  }

  return (
    <div className="min-h-svh bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <span className="font-semibold">NoteGest</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-balance">Recherche d&apos;un candidat</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saisissez le matricule du candidat pour consulter et corriger ses notes.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex : C-1001"
              className="h-12 pl-10 text-base"
            />
          </div>
          <Button type="submit" className="h-12 px-6 text-base">
            Rechercher
          </Button>
        </form>

        {candidate && (
          <CandidateCard
            candidate={candidate}
            onChange={(c) => {
              setCandidate(c)
              setEdits(getEdits())
            }}
          />
        )}

        {notFound && !candidate && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed bg-card p-10 text-center">
            <SearchX className="size-8 text-muted-foreground" />
            <p className="font-medium">Aucun candidat trouvé</p>
            <p className="text-sm text-muted-foreground">Vérifiez le matricule et réessayez.</p>
          </div>
        )}

        <EditHistory edits={edits} />
      </main>
    </div>
  )
}
