"use client"

import { useState } from "react"
import type { Candidate, Subject } from "@/lib/types"
import { SUBJECT_LABELS } from "@/lib/types"
import { updateNote } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, User2 } from "lucide-react"
import { toast } from "sonner"

const SUBJECTS: Subject[] = ["francais", "mathematiques", "expressionOrale"]

function noteColor(value: number) {
  if (value >= 14) return "text-emerald-600"
  if (value >= 10) return "text-amber-600"
  return "text-destructive"
}

export function CandidateCard({
  candidate,
  onChange,
}: {
  candidate: Candidate
  onChange: (c: Candidate) => void
}) {
  const [editing, setEditing] = useState<Subject | null>(null)
  const [draft, setDraft] = useState("")

  function openEdit(subject: Subject) {
    setEditing(subject)
    setDraft(String(candidate.notes[subject]))
  }

  function save() {
    if (editing === null) return
    const val = Number(draft)
    if (Number.isNaN(val) || val < 0 || val > 20) {
      toast.error("La note doit être un nombre entre 0 et 20.")
      return
    }
    const updated = updateNote(candidate.matricule, editing, val)
    if (updated) {
      if (updated.notes[editing] !== candidate.notes[editing]) {
        toast.success(`${SUBJECT_LABELS[editing]} modifiée : ${candidate.notes[editing]} → ${val}`)
      } else {
        toast.info("Aucun changement, la note est identique.")
      }
      onChange(updated)
    }
    setEditing(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center gap-4 border-b bg-accent/50 p-5">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User2 className="size-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold leading-tight">{candidate.fullName}</h3>
          <p className="text-sm text-muted-foreground">Matricule : {candidate.matricule}</p>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-3">
        {SUBJECTS.map((subject) => (
          <div key={subject} className="flex flex-col gap-2 rounded-xl border bg-background p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {SUBJECT_LABELS[subject]}
            </span>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-bold tabular-nums ${noteColor(candidate.notes[subject])}`}>
                {candidate.notes[subject]}
                <span className="text-base font-normal text-muted-foreground">/20</span>
              </span>
              <Button size="sm" variant="ghost" className="h-8 gap-1 text-primary" onClick={() => openEdit(subject)}>
                <Pencil className="size-3.5" />
                Corriger
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Corriger la note</DialogTitle>
            <DialogDescription>
              {editing && (
                <>
                  {SUBJECT_LABELS[editing]} — {candidate.fullName}. Laissez la valeur inchangée pour annuler.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Nouvelle note (sur 20)</Label>
            <Input
              id="note"
              type="number"
              min={0}
              max={20}
              step="0.5"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Annuler
            </Button>
            <Button onClick={save}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
